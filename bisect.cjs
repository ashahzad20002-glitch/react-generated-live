const { chromium } = require('playwright');
const fs = require('fs');

async function testPage(content) {
  fs.writeFileSync('src/App.tsx', content);
  // Wait a bit for Vite to HMR or just restart? HMR should be fine, but we will go to the page.
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
  const components = [
    '<HeroSection />', '<ManifestoSection />', '<KineticMarquee />',
    '<PhilosophySection />', '<PrinciplesSection />', '<GridSection />',
    '<SiteContextSection />', '<MaterialitySection />', '<ExhibitionSection />',
    '<ReviewsSection />', '<HorizontalProjects />', '<ProcessSection />',
    '<IntegratedExpertiseSection />', '<ServicesSection />', '<TimelineSection />',
    '<ArchiveSection />'
  ];
  
  for (const c of components) {
    let testContent = original.replace(c, '');
    const hasError = await testPage(testContent);
    console.log(c, hasError ? 'ERROR' : 'OK (Error disappeared!)');
    if (!hasError) {
       console.log('Found it!', c);
       break;
    }
  }
  
  // Restore
  fs.writeFileSync('src/App.tsx', original);
})();
