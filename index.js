import cherio from 'cherio';
import chalk from 'chalk';

import {getPageContent} from './helpers/puppeteer.js';


const SITE = 'https://royaleapi.com/clan/89VLQR0';
const WARPAGE = 'https://royaleapi.com/clan/89VLQR0/war/analytics';


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

    let warContent = await getPageContent(WARPAGE);

    $.load(warContent);
    $ = cherio.load(warContent);

    $('.war_table_wrapper tbody .war_member').each((i, contentRowLink) => {
      let tag = $(contentRowLink).attr('data-tag');
      let mia = $(contentRowLink).find('td:nth-of-type(4)').attr('data-sort-value');

    })
    

  }catch (error){
    console.log(chalk.red('error: \n'));
    console.log(error);
  }
})();