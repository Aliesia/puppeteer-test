import {getPageContent} from '../helpers/puppeteer.js';
import cherio from 'cherio';
import dotenv from 'dotenv';
dotenv.config();

const WARPAGE = process.env.CLAN_URL + '/war/analytics';

export default async function warDataImporter(clanMembers){

    let warContent = await getPageContent(WARPAGE, 'warPage');
    let $ = cherio.load(warContent);

    $('.war_table_wrapper tbody .war_member').each((i, contentRowLink) => {
      let tag = $(contentRowLink).attr('data-tag');
      let mia = $(contentRowLink).find('td:nth-of-type(4)').attr('data-sort-value');
      let lastBattlesScore =
      parseInt($(contentRowLink).find('td:nth-child(5)').attr('data-sort-value')) + 
      parseInt($(contentRowLink).find('td:nth-child(6)').attr('data-sort-value')) + 
      parseInt($(contentRowLink).find('td:nth-child(7)').attr('data-sort-value'));


      if (!clanMembers[tag]) {
        return;
      }

      clanMembers[tag].mia = mia;
      clanMembers[tag].lastBattlesScore = lastBattlesScore;

    })

    return clanMembers;
}
