const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = {
  '1541888079893-6b7cbe3239cb': '1513694203232-719a280e022f',
  '1628744448840-798835e7df12': '1600596542815-ffad4c1539a9',
  '1620603738096-7b4474744dcc': '1512917774080-9991f1c4c750',
  '1580227367200-8d8a7a8cf6fe': '1524661135-423995f22d0b',
  '1588636437637-640aeb752b02': '1600607687939-ce8a6c25118c',
  '1600868471018-936dff35a0ce': '1497366754035-f200968a6e72',
  '1558244917-70e6c51b2fc8': '1600607686527-6fb886090705'
};

for (const [broken, working] of Object.entries(replacements)) {
  code = code.split(broken).join(working);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Done');
