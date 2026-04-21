const { chromium } = require('playwright');
const fs = require('fs');

async function testPage(content) {
  fs.writeFileSync('src/App.tsx', content);
  await new Promise(r => setTimeout(r, 1000));
  
  let foundError = false;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', err => {
    if (err.toString().includes('execute \'animate\' on \'Element\'')) foundError = true;
  });
  
  try {
    await page.goto('http://localhost:3001');
    await page.waitForTimeout(1000);
  } catch(e) {}
  await browser.close();
  return foundError;
}

(async () => {
  const original = fs.readFileSync('src/App.tsx', 'utf8');
  let fixed = original.replace(
    /const scale = useTransform\(\n\s*scrollYProgress,\n\s*\[centerPos - stepSize \* 1.5, centerPos, centerPos \+ stepSize\],\n\s*\[0.6, 1, 1.4\],\n\s*\);/g,
    `const scale = useTransform(
            scrollYProgress,
            [centerPos - stepSize * 1.5, centerPos, centerPos + stepSize].map(v => Math.max(0, Math.min(1, v))),
            [0.6, 1, 1.4],
          );`
  );
  fixed = fixed.replace(
    /const opacity = useTransform\(\n\s*scrollYProgress,\n\s*\[\n\s*centerPos - stepSize,\n\s*centerPos,\n\s*centerPos \+ stepSize \/ 2,\n\s*centerPos \+ stepSize,\n\s*\],\n\s*\[0, 1, 1, 0\],\n\s*\);/g,
    `const opacity = useTransform(
            scrollYProgress,
            [
              centerPos - stepSize,
              centerPos,
              centerPos + stepSize / 2,
              centerPos + stepSize,
            ].map(v => Math.max(0, Math.min(1, v))),
            [0, 1, 1, 0],
          );`
  );
  fixed = fixed.replace(
    /const blurNum = useTransform\(\n\s*scrollYProgress,\n\s*\[centerPos - stepSize \* 1.2, centerPos, centerPos \+ stepSize\],\n\s*\[15, 0, 15\],\n\s*\);/g,
    `const blurNum = useTransform(
            scrollYProgress,
            [centerPos - stepSize * 1.2, centerPos, centerPos + stepSize].map(v => Math.max(0, Math.min(1, v))),
            [15, 0, 15],
          );`
  );
  fixed = fixed.replace(
    /const y = useTransform\(\n\s*scrollYProgress,\n\s*\[centerPos - stepSize, centerPos, centerPos \+ stepSize\],\n\s*\["20vh", "0vh", "-30vh"\],\n\s*\);/g,
    `const y = useTransform(
            scrollYProgress,
            [centerPos - stepSize, centerPos, centerPos + stepSize].map(v => Math.max(0, Math.min(1, v))),
            ["20vh", "0vh", "-30vh"],
          );`
  );
  const error = await testPage(fixed);
  console.log('Error still there:', error);
  fs.writeFileSync('src/App.tsx', original);
})();
