import cherio from 'cherio';
import chalk from 'chalk';

import {getPageContent} from './helpers/puppeteer.js';


const SITE = 'https://royaleapi.com/clan/89VLQR0';



(async () => {
  try{
    let content = await getPageContent(SITE);
    let $ = cherio.load(content);
    let clanMembers = [];

    $('#roster tbody tr').each((i, siteMember) => {
      let tag = $(siteMember).attr('data-tag');
      let role = $(siteMember).attr('data-role');
    
      clanMembers.push({
        'tag': tag,
        'role': role
      })
    })

    console.log(clanMembers);

  }catch (error){
    console.log(chalk.red('error: \n'));
    console.log(error);
  }
})();