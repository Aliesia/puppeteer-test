import {getPageContent} from '../helpers/puppeteer.js';
import Member from '../models/member.js';
import cherio from 'cherio';
import dotenv from 'dotenv';
dotenv.config();

export default class ImportService {

    static async clanDataImporter(){
        const SITE = process.env.CLAN_URL;
        const REPORT_FILENAME = 'Info';

        let content = await getPageContent(SITE, REPORT_FILENAME);
        let $ = cherio.load(content);
        let clanMembers = {};
        
        $('#roster tbody tr').each((i, siteMember) => {
          let tag = $(siteMember).attr('data-tag');
          let role = $(siteMember).attr('data-role');
          let name = $(siteMember).find('td:nth-of-type(2) a').clone().children().remove().end().text();
          let donation = $(siteMember).find('td:nth-of-type(10)').attr('data-sort-value');
          let joinStatus = $(siteMember).find('td:nth-of-type(2) .join_status').text();
          
        
          clanMembers[tag] = new Member({
            role: role,
            name: name.trim(),
            tag:tag,
            donation: parseInt(donation)
          });
          
          if(joinStatus.replace(/\s/g,"") != ""){
            clanMembers[tag].join_status = joinStatus;
          }
        })
         return clanMembers;
    }
        
    static async warDataImporter(clanMembers){
        const WARPAGE = process.env.CLAN_URL + '/war/analytics';
        const REPORT_FILENAME = 'warPage';

        let warContent = await getPageContent(WARPAGE, REPORT_FILENAME);
        let $ = cherio.load(warContent);
    
        $('.war_table_wrapper tbody .war_member').each((i, contentRowLink) => {
          let tag = $(contentRowLink).attr('data-tag');
          let lastBattlesScore =
            parseInt($(contentRowLink).find('td:nth-child(5)').attr('data-sort-value')) + 
            parseInt($(contentRowLink).find('td:nth-child(6)').attr('data-sort-value')) + 
            parseInt($(contentRowLink).find('td:nth-child(7)').attr('data-sort-value'));
    
          if (!clanMembers[tag]) {
            return;
          }
    
          clanMembers[tag].mia = parseInt($(contentRowLink).find('td:nth-of-type(4)').attr('data-sort-value'));
          clanMembers[tag].lastBattlesScore = lastBattlesScore;
          clanMembers[tag].winRate = parseInt($(contentRowLink).find('td:nth-child(2)').text());
          clanMembers[tag].battlesCount = parseInt($(contentRowLink).find('td:nth-child(3)').text());
    
        })

        $('div:nth-child(5) > div > table > tbody > tr').each((i, contentRowLink)=> {
          if ($(contentRowLink).attr('data-current') != 1){
            return;
          }

          let href = $(contentRowLink).find('td a').attr('href');
          let tag = href.replace('/player/', '');

          if (!clanMembers[tag]) {
            return;
          }
          
          clanMembers[tag].negative_indicator = $(contentRowLink).find('.negative_indicator').length;
        })
    
        return clanMembers;
    }

    static userClanHistoryImporter(member){
      async function fetchClanHistory(member) {
        async function toJson(text){
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(JSON.parse(text))
            })
          })
        }
        const SITE = 'https://royaleapi.com/data/player/clan_history/?clan_tag=89VLQR0&player_tag=' + member.tag;

        let content = await getPageContent(SITE);
        let $ = await cherio.load(content);
        let body = await $('pre').text();
        let json = await toJson(body);

        return json.history[0].short_ts;
      }
      
      return fetchClanHistory(member);
  }
}
