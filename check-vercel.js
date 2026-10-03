const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));

  console.log('Navigating to Vercel site...');
  await page.goto('https://gdgoc-six.vercel.app/events', { waitUntil: 'networkidle2' });
  
  console.log('Waiting 3 seconds for effects...');
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})();
