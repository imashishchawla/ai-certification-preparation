import fs from 'fs';
import path from 'path';

export function scaffoldExam(rootDir, examId, name, code, provider = 'Anthropic') {
  console.log(`[Cert Prep Curator] Scaffolding new exam: ${examId} (${code})...`);

  const contentDir = path.join(rootDir, `content/exams/${examId}`);
  const dataDir = path.join(rootDir, `data/questions/${examId}`);
  const machineDir = path.join(rootDir, `.data/exams/${examId}`);
  const staticDir = path.join(rootDir, `static/assets/${examId}`);

  const subdirs = [
    'sample-questions',
    'mock-test',
    'study-guides',
    'exam-notes',
    'articles',
    'study-materials',
    'resources'
  ];

  // 1. Create content subdirectories
  subdirs.forEach(sub => {
    fs.mkdirSync(path.join(contentDir, sub), { recursive: true });
    const indexFile = path.join(contentDir, sub, '_index.md');
    if (!fs.existsSync(indexFile)) {
      const title = sub.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
      fs.writeFileSync(indexFile, `---\ntitle: "${title}"\ndescription: "${title} for ${code}."\nlayout: "${sub === 'sample-questions' || sub === 'mock-test' ? sub : 'list'}"\ntype: "${sub}"\n---\n`);
    }
  });

  // 2. Create landing page
  const mainIndex = path.join(contentDir, '_index.md');
  if (!fs.existsSync(mainIndex)) {
    fs.writeFileSync(mainIndex, `---\ntitle: "${name} (${code})"\ndescription: "Exam guide, practice questions, and study material for ${name}."\nlayout: "single"\n---\n\n# ${name} (${code})\n\nWelcome to the **${name}** prep library.\n`);
  }

  // 3. Create question data directory & initial file
  fs.mkdirSync(dataDir, { recursive: true });
  const questionsFile = path.join(dataDir, 'questions.json');
  if (!fs.existsSync(questionsFile)) {
    fs.writeFileSync(questionsFile, JSON.stringify([], null, 2));
  }

  // 4. Create machine & static directories
  fs.mkdirSync(path.join(machineDir, 'raw'), { recursive: true });
  fs.mkdirSync(path.join(machineDir, 'extracted'), { recursive: true });
  fs.mkdirSync(path.join(staticDir, 'pdfs'), { recursive: true });
  fs.mkdirSync(path.join(staticDir, 'documents'), { recursive: true });

  console.log(`[Cert Prep Curator] Successfully scaffolded ${examId} structure.`);
}

if (process.argv[1].endsWith('scaffold-exam.mjs')) {
  const rootDir = process.cwd();
  const examId = process.argv[2] || 'new-exam';
  const name = process.argv[3] || 'New Certification Exam';
  const code = process.argv[4] || 'NEW-CERT';
  scaffoldExam(rootDir, examId, name, code);
}
