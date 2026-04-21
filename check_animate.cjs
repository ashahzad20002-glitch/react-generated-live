const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const matches = content.match(/(animate|initial|whileInView|exit)=\{\{([^}]+)\}\}/g) || [];
matches.forEach(m => {
  if (m.includes('[')) console.log(m.replace(/\s+/g, ' '));
});
