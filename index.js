import cherio from 'cherio';
import chalk from 'chalk';

import {getPageContent} from './helpers/puppeteer.js';


const SITE = 'https://royaleapi.com/clan/89VLQR0';



(async () => {
  try{
    let content = await getPageContent(SITE);
    console.log(content);

  }catch (error){
    console.log(chalk.red('error: \n'));
    console.log(error);
  }
})();