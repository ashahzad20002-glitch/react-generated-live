const https = require('https');
const fs = require('fs');

const code = fs.readFileSync('src/App.tsx', 'utf8');
const urls = [...code.matchAll(/https:\/\/[^"'\s\)]+/g)].map(m => m[0]);
const uniqueUrls = [...new Set(urls)].filter(u => u.includes('image'));

async function check() {
  for (const url of uniqueUrls) {
    await new Promise(r => {
      const req = https.request(url, { method: 'HEAD', timeout: 2000 }, (res) => {
        if (res.statusCode >= 400 && res.statusCode !== 405) {
          console.log(`BROKEN: ${res.statusCode} ${url}`);
        } else {
          console.log(`OK: ${res.statusCode} ${url}`);
        }
        r();
      });
      req.on('error', (err) => {
        console.log(`BROKEN: error ${url}`);
        r();
      });
      req.on('timeout', () => {
        console.log(`BROKEN: timeout ${url}`);
        req.destroy();
        r();
      });
      req.end();
    });
  }
}
check();
