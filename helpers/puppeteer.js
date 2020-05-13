import puppeteer from 'puppeteer';

export const LAUNCH_PUPPETEER_OPTS = {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080'
    ]
  };
  
export const PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout: 5000,
    waitUntil: 'networkidle2',
    timeout: 3000000
  };

export async function getPageContent(url){
    let browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    let page = await browser.newPage();
    await page.goto(url, PAGE_PUPPETEER_OPTS);
    let content = await page.content();
    await browser.close();
    
    return content;
}
