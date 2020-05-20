import {getPageContent} from '../helpers/puppeteer.js';
import cherio from 'cherio';

const WARPAGE = 'https://royaleapi.com/clan/89VLQR0/war/analytics';

export default async function warDataImporter(clanMembers){

    let warContent = await getPageContent(WARPAGE, 'warPage');
    let $ = cherio.load(warContent);

    $('.war_table_wrapper tbody .war_member').each((i, contentRowLink) => {
      let tag = $(contentRowLink).attr('data-tag');
      let mia = $(contentRowLink).find('td:nth-of-type(4)').attr('data-sort-value');

      if (!clanMembers[tag]) {
        return;
      }

      clanMembers[tag].mia = mia;
      
    })
    return clanMembers;
}
