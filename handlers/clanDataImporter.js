import {getPageContent} from '../helpers/puppeteer.js';
import cherio from 'cherio';
import dotenv from 'dotenv';
dotenv.config();

const SITE = process.env.CLAN_URL;
const REPORT_FILENAME = 'Info';

export default async function clanDataImporter(){

let content = await getPageContent(SITE, REPORT_FILENAME);
let $ = cherio.load(content);
let clanMembers = {};

$('#roster tbody tr').each((i, siteMember) => {
  let tag = $(siteMember).attr('data-tag');
  let role = $(siteMember).attr('data-role');
  let name = $(siteMember).find('td:nth-of-type(2) a').clone().children().remove().end().text();
  let donation = $(siteMember).find('td:nth-of-type(10)').attr('data-sort-value');
  let joinStatus = $(siteMember).find('td:nth-of-type(2) .join_status').text();
  

  clanMembers[tag] = {
    role: role,
    name: name.trim(),
    tag:tag,
    donation: parseInt(donation)
  };
  
  if(joinStatus.replace(/\s/g,"") != ""){
    clanMembers[tag].join_status = joinStatus;
  }
})
 return clanMembers;
}
