import cherio from 'cherio';
import chalk from 'chalk';

import {getPageContent} from './helpers/puppeteer.js';


const SITE = 'https://royaleapi.com/clan/89VLQR0';
const WARPAGE = 'https://royaleapi.com/clan/89VLQR0/war/analytics';


(async () => {
  try{
    let content = await getPageContent(SITE, 'Info');
    let $ = cherio.load(content);
    let clanMembers = {};

    $('#roster tbody tr').each((i, siteMember) => {
      let tag = $(siteMember).attr('data-tag');
      let role = $(siteMember).attr('data-role');
      let name = $(siteMember).find('td:nth-of-type(2)').attr('data-sort-value');
      let joinStatus = $(siteMember).find('td:nth-of-type(2) .join_status').text();

      clanMembers[tag] = {
        role: role,
        name: name,
        tag:tag
      };
      
      if(joinStatus.replace(/\s/g,"") != ""){
        clanMembers[tag].join_status = joinStatus;
      }
    })


    let warContent = await getPageContent(WARPAGE, 'warPage');

    $.load(warContent);
    $ = cherio.load(warContent);

    $('.war_table_wrapper tbody .war_member').each((i, contentRowLink) => {
      let tag = $(contentRowLink).attr('data-tag');
      let mia = $(contentRowLink).find('td:nth-of-type(4)').attr('data-sort-value');

      if (!clanMembers[tag]) {
        return;
      }

      clanMembers[tag].mia = mia;
      
    })
    inactiveMembersReport(clanMembers);
    
  }catch (error){
    console.log(chalk.red('error: \n'));
    console.log(error);
  }
})();

function inactiveMembersReport(memberList){
  let inactiveMembers = []

  for (let [tag, member] of Object.entries(memberList)){
      if(!('mia' in member) && !('join_status' in member)){
        inactiveMembers.push(member.name);
      }
  }
  
  console.log(chalk.magenta('Players without participation in last 10 wars'));
  console.log(inactiveMembers);
  console.log(chalk.magenta('Total: ' + inactiveMembers.length));

  return inactiveMembers;
}
