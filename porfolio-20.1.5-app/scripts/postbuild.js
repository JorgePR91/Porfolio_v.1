const fs = require('fs');
const path = require('path');

// adjust this path if you change outputPath in angular.json
const distPath = path.resolve(__dirname, '..', 'dist', 'porfolio-20.1.5-app');
// Try common locations for index.html (dist root, dist/browser)
const candidates = [
  path.join(distPath, 'index.html'),
  path.join(distPath, 'browser', 'index.html'),
];

function findIndexFile() {
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  // fallback: simple recursive search (first match)
  const stack = [distPath];
  while (stack.length) {
    const cur = stack.pop();
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isFile() && e.name === 'index.html') return full;
      if (e.isDirectory()) stack.push(full);
    }
  }
  return null;
}

const found = findIndexFile();
if (!found) {
  console.error('index.html not found in dist:', distPath);
  process.exitCode = 1;
} else {
  const notFoundFile = path.join(path.dirname(found), '404.html');
  fs.copyFileSync(found, notFoundFile);
  console.log('Copied', found, 'to', notFoundFile, 'for SPA routing');
}
