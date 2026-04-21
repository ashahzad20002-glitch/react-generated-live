const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const urls = [...content.matchAll(/https:\/\/images\.unsplash\.com\/[^"']+/g)].map(m => m[0]);
const counts = {};
urls.forEach(u => {
  const id = u.match(/photo-[^?]+/)?.[0] || u;
  counts[id] = (counts[id] || 0) + 1;
});
Object.entries(counts).sort((a,b) => b[1]-a[1]).forEach(([id, n]) => {
  console.log(n, id);
});
