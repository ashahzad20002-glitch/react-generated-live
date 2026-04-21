const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const transforms = content.match(/useTransform\([^\]]+\][^\]]+\]/g) || [];
transforms.forEach(t => {
  const match = t.match(/\[([0-9\., \-]+)\]/);
  if (match) {
    const nums = match[1].split(',').map(n => parseFloat(n.trim()));
    let monotonic = true;
    for (let i = 1; i < nums.length; i++) {
       if (nums[i] < nums[i-1]) monotonic = false;
    }
    if (!monotonic) console.log('INVALID:', t);
  }
});
