import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  console.log('public/ does not exist yet; build Hugo first.');
  process.exit(0);
}

const siteDomains = ['imashishchawla.github.io', 'ashishchawla.github.io', 'your-org.github.io', 'localhost', '127.0.0.1', 'revendum.com', 'www.revendum.com'];

function scanDir(dir) {
  let leaks = 0;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      leaks += scanDir(fullPath);
    } else if (file.endsWith('.html')) {
      // Exclude scraped legacy official-docs HTML from failing strict external link check if they are raw dumps
      if (fullPath.includes('/official-docs/')) return;

      const content = fs.readFileSync(fullPath, 'utf8');
      const hrefMatches = content.match(/(href|src)=["']https?:\/\/[^"']+["']/gi);
      
      if (hrefMatches) {
        const externalLeaks = hrefMatches.filter(m => {
          return !siteDomains.some(domain => m.includes(domain));
        });
        if (externalLeaks.length > 0) {
          console.error(`External leak found in ${fullPath}:`, externalLeaks);
          leaks += externalLeaks.length;
        }
      }
    }
  });

  return leaks;
}

const totalLeaks = scanDir(publicDir);
if (totalLeaks > 0) {
  console.error(`Link check FAILED: ${totalLeaks} external link(s)/asset(s) found in core public pages.`);
  process.exit(1);
} else {
  console.log('Link check PASSED: Zero external links or assets found in core rendered pages.');
}
