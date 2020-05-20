import {getPageContent} from '../helpers/puppeteer.js';
import cherio from 'cherio';

const SITE = 'https://royaleapi.com/clan/89VLQR0';

export default async function clanDataImporter(){

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
 return clanMembers;
}
