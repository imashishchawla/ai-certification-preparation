import { execSync, spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let hasHugo = false;
try {
  const version = execSync('hugo version', { encoding: 'utf8', cwd: rootDir });
  console.log('[Cert Prep Launcher] Detected Hugo:', version.trim());
  hasHugo = true;
} catch (e) {
  console.log('[Cert Prep Launcher] Hugo is not installed in system PATH.');
}

if (hasHugo) {
  console.log('[Cert Prep Launcher] Starting Hugo development server at http://localhost:1313/ ...');
  const server = spawn('hugo', ['server', '--bind', '127.0.0.1', '-p', '1313'], {
    cwd: rootDir,
    stdio: 'inherit'
  });

  server.on('error', (err) => {
    console.error('[Cert Prep Launcher] Hugo server error:', err.message);
    startFallbackServer();
  });
} else {
  console.log('\n=============================================================');
  console.log('NOTICE: Hugo binary not found on your system.');
  console.log('To edit & build site source, install Hugo Extended:');
  console.log('  - macOS: brew install hugo');
  console.log('  - Linux: sudo snap install hugo');
  console.log('=============================================================\n');

  startFallbackServer();
}

function startFallbackServer() {
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    console.error('[Cert Prep Launcher] ERROR: "public/" directory does not exist. Run "npm run build" with Hugo installed first.');
    process.exit(1);
  }

  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.woff2': 'font/woff2'
  };

  const port = 1313;
  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl.endsWith('/')) reqUrl += 'index.html';
    let filePath = path.join(publicDir, reqUrl);

    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1><p>The requested static page does not exist in public/.</p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`[Cert Prep Launcher] Serving static site from public/ at http://localhost:1313/`);
  });
}
