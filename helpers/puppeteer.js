import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path'
import dotenv from 'dotenv';
dotenv.config();

export const LAUNCH_PUPPETEER_OPTS = {
  executablePath: process.env.CHROMEDRIVER_URL,

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
    networkIdle2Timeout: 5 * 1000,
    waitUntil: 'networkidle2',
    timeout: 1 * 60 * 1000
  };
  
export const SLEEP_TIME = 10 * 1000;

export async function getPageContent(url, fileName = null){
    let browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    let page = await browser.newPage();
    await page.goto(url, PAGE_PUPPETEER_OPTS);
    await page.waitFor(SLEEP_TIME)

    if (fileName){
      await generatePDF(page, fileName);
    }

    let content = await page.content();
    await browser.close();
    
    return content;
}

async function generatePDF(page, fileName){

  let folderPath = path.join(path.dirname(''), 'data', getDateString());
  await fs.promises.mkdir(folderPath,{recursive:true});

  await page.pdf({ 
    path: folderPath + '/'+ fileName +'.pdf',
    format: 'A4',
    landscape: true
  })

}

function getDateString() {
  const date = new Date();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day =`${date.getDate()}`.padStart(2, '0');
  const minutes = date.getMinutes();
  const hour = date.getHours();

  return `${month}.${day}_${hour}-${minutes}`
}
