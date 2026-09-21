import fs from 'fs';
import path from 'path';
import https from 'https';

/**
 * Fetches questions from CertyIQ backend REST API using the discovered headers & payload schema.
 */
function fetchCertyIQPage(paperName, paperId, page = 0, limit = 20) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      filter: {
        stream: 'anthropic',
        name: paperName,
        paperid: paperId
      },
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
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.data || []);
          } catch (err) {
            reject(new Error(`Failed to parse CertyIQ JSON: ${err.message}`));
          }
        } else {
          // Non-200 (e.g. 404 on out-of-bounds page or protected tier)
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
 * Synchronizes raw questions from CertyIQ for the specified exam track into .data/
 */
export async function syncCertyIQ(rootDir, examId = 'cca-f') {
  console.log(`[CertyIQ Sync] Synchronizing live API questions for ${examId}...`);
  const certyiqDir = path.join(rootDir, `.data/exams/${examId}/raw/mock-exams-questions/certyiq`);
  if (!fs.existsSync(certyiqDir)) {
    fs.mkdirSync(certyiqDir, { recursive: true });
  }

  const papers = [
    { name: 'Claude Certified Architect - Foundations', id: 'claude-certified-architect', pages: 2, isCore: true },
    { name: 'Claude Certified Developer Foundations', id: 'ccdv-f', pages: 1, isCore: false },
    { name: 'Claude Certified Associate Foundations CCAO-F', id: 'ccao-f', pages: 1, isCore: false },
    { name: 'Claude Certified Architect Professional (CCAR-P)', id: 'ccar-p', pages: 1, isCore: false }
  ];

  const coreQuestions = [];
  const allTracksQuestions = [];

  for (const paper of papers) {
    console.log(`[CertyIQ Sync] Querying paper: ${paper.name} (${paper.id})...`);
    for (let p = 0; p < paper.pages; p++) {
      try {
        const items = await fetchCertyIQPage(paper.name, paper.id, p, 20);
        console.log(`  Page ${p}: fetched ${items.length} items.`);
        items.forEach(item => {
          item._sourcePaper = paper.id;
          item._sourcePaperName = paper.name;
        });

        if (paper.isCore) {
          coreQuestions.push(...items);
        }
        allTracksQuestions.push(...items);
      } catch (err) {
        console.warn(`  [WARN] Failed to fetch page ${p} for ${paper.id}: ${err.message}`);
      }
    }
  }

  // Save raw data files
  const coreFile = path.join(certyiqDir, 'certyiq-cca-f-api.json');
  fs.writeFileSync(coreFile, JSON.stringify(coreQuestions, null, 2));
  console.log(`[CertyIQ Sync] Saved ${coreQuestions.length} core CCA-F questions to ${coreFile}`);

  const allFile = path.join(certyiqDir, 'certyiq-all-tracks-api.json');
  fs.writeFileSync(allFile, JSON.stringify(allTracksQuestions, null, 2));
  console.log(`[CertyIQ Sync] Saved ${allTracksQuestions.length} all-track questions to ${allFile}`);

  return { coreCount: coreQuestions.length, allCount: allTracksQuestions.length };
}

if (process.argv[1]?.endsWith('sync-certyiq.mjs')) {
  const rootDir = process.cwd();
  const examId = process.argv[2] || 'cca-f';
  syncCertyIQ(rootDir, examId);
}
