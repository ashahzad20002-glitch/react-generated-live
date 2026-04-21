const fs = require('fs');
const https = require('https');

const code = fs.readFileSync('src/App.tsx', 'utf8');
const urls = [...code.matchAll(/https:\/\/[^"']+/g)].map(m => m[0]);
const uniqueUrls = [...new Set(urls)].filter(u => u.includes('image'));

uniqueUrls.forEach(url => {
  https.request(url, { method: 'HEAD' }, (res) => {
    if (res.statusCode >= 400) {
      console.log(`BROKEN: ${res.statusCode} ${url}`);
    } else {
      console.log(`OK: ${res.statusCode} ${url}`);
    }
  }).end();
});
