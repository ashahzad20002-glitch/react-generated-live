const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const appStart = content.indexOf('export default function App');
const appEnd = content.indexOf('function SpatialTiltCard');
console.log(content.substring(appStart, appEnd));
