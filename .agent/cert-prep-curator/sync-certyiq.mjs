import fs from 'fs';
import path from 'path';
import https from 'https';

/**
 * Fetches one page of questions from the CertyIQ backend REST API.
 *
 * @param {string} stream   - CertyIQ stream value (e.g. "hashicorp", "anthropic")
 * @param {string} paperName
 * @param {string} paperId
 * @param {number} page     - 0-based page index
 * @param {number} limit    - items per page (max 20 observed in the wild)
 * @returns {Promise<object[]>}
 */
function fetchCertyIQPage(stream, paperName, paperId, page = 0, limit = 20) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      filter: { stream, name: paperName, paperid: paperId },
      page,
      limit
    });

    const options = {
      hostname: 'dev.certyiq.com',
      port: 443,
      path: '/v1/product/postExamPapers',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'project': 'certyiq',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Origin': 'https://certyiq.com',
        'Referer': 'https://certyiq.com/'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data).data || []);
          } catch (err) {
            reject(new Error(`Failed to parse CertyIQ JSON for paper "${paperId}" page ${page}: ${err.message}`));
          }
        } else {
          // 404 on out-of-bounds page or protected tier — treat as empty
          resolve([]);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Syncs raw CertyIQ questions for a single exam using the source entry from sources.json.
 *
 * This function is exam-agnostic. All configuration (stream, papers) comes from the
 * source entry — never from hardcoded values inside this file.
 *
 * @param {string}   rootDir   - Absolute path to the repository root
 * @param {string}   examId    - Exam ID (e.g. "cca-f", "terraform-associate")
 * @param {object}   source    - Source entry from sources.json with parser_adapter="certyiq-api"
 *                              Must have: certyiq_stream, certyiq_papers[]
 * @param {object}   [opts]
 * @param {number}   [opts.pageLimit]  - Hard cap on pages per paper (default: paper.pages from config)
 * @returns {Promise<{coreCount: number, allCount: number, byPaper: object}>}
 */
export async function syncCertyIQ(rootDir, examId, source, opts = {}) {
  const stream = source.certyiq_stream;
  const papers = source.certyiq_papers || [];

  if (!stream) {
    throw new Error(`[CertyIQ Sync] source "${source.id}" is missing certyiq_stream`);
  }
  if (papers.length === 0) {
    throw new Error(`[CertyIQ Sync] source "${source.id}" has no certyiq_papers entries`);
  }

  console.log(`[CertyIQ Sync] exam=${examId} stream=${stream} papers=${papers.length} source=${source.id}`);

  const certyiqDir = path.join(
    rootDir, `.data/exams/${examId}/raw/mock-exams-questions/${source.id}`
  );
  if (!fs.existsSync(certyiqDir)) {
    fs.mkdirSync(certyiqDir, { recursive: true });
  }

  const coreQuestions = [];
  const allQuestions  = [];
  const byPaper       = {};

  for (const paper of papers) {
    const pageCount = opts.pageLimit ?? paper.pages ?? 1;
    console.log(`  [Paper] ${paper.name} (id=${paper.id} pages=${pageCount} isCore=${!!paper.isCore})`);
    byPaper[paper.id] = 0;

    for (let p = 0; p < pageCount; p++) {
      try {
        const items = await fetchCertyIQPage(stream, paper.name, paper.id, p, 20);
        console.log(`    page ${p}: ${items.length} items`);

        items.forEach(item => {
          item._sourcePaper     = paper.id;
          item._sourcePaperName = paper.name;
          item._stream          = stream;
          item._examId          = examId;
        });

        if (paper.isCore) coreQuestions.push(...items);
        allQuestions.push(...items);
        byPaper[paper.id] += items.length;
      } catch (err) {
        console.warn(`    [WARN] page ${p} for "${paper.id}": ${err.message}`);
      }
    }
  }

  // Write per-paper files for traceability
  for (const paper of papers) {
    const paperItems = allQuestions.filter(q => q._sourcePaper === paper.id);
    const outFile = path.join(certyiqDir, `${paper.id}.json`);
    fs.writeFileSync(outFile, JSON.stringify(paperItems, null, 2));
    console.log(`  -> ${outFile} (${paperItems.length} items)`);
  }

  // Write core-only aggregate (isCore=true papers only)
  const coreFile = path.join(certyiqDir, `${examId}-core.json`);
  fs.writeFileSync(coreFile, JSON.stringify(coreQuestions, null, 2));
  console.log(`  -> ${coreFile} (${coreQuestions.length} core items)`);

  // Write full aggregate
  const allFile = path.join(certyiqDir, `${examId}-all.json`);
  fs.writeFileSync(allFile, JSON.stringify(allQuestions, null, 2));
  console.log(`  -> ${allFile} (${allQuestions.length} total items)`);

  console.log(`[CertyIQ Sync] Done. core=${coreQuestions.length} all=${allQuestions.length}`);
  return { coreCount: coreQuestions.length, allCount: allQuestions.length, byPaper };
}

// ─── CLI entry point ──────────────────────────────────────────────────────────
if (process.argv[1]?.endsWith('sync-certyiq.mjs')) {
  const rootDir = process.cwd();
  const examId  = process.argv[2];

  if (!examId) {
    console.error('Usage: node sync-certyiq.mjs <examId>');
    console.error('       (exam must have a certyiq-api source in sources.json)');
    process.exit(1);
  }

  const sourcesPath = path.join(rootDir, '.agent/cert-prep-curator/sources.json');
  const registry    = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  const examSources = registry.exams?.[examId]?.sources ?? [];
  const certyiqSrc  = examSources.find(s => s.parser_adapter === 'certyiq-api' && s.active);

  if (!certyiqSrc) {
    console.error(`[CertyIQ Sync] No active certyiq-api source found for exam "${examId}" in sources.json`);
    process.exit(1);
  }

  syncCertyIQ(rootDir, examId, certyiqSrc).catch(err => {
    console.error('[CertyIQ Sync] Fatal:', err.message);
    process.exit(1);
  });
}
