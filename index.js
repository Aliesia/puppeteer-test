import chalk from 'chalk';

import inactiveMembersReport from './handlers/inactiveReport.js'
import {missBattlePlayers, topPlayersRank} from './handlers/warBattlesReport.js'
import clanDataImporter from './handlers/clanDataImporter.js'
import warDataImporter from './handlers/warDataImporter.js'

(async () => {
  try{

    let clanMembers = await clanDataImporter();
    let warData = await warDataImporter(clanMembers);

    inactiveMembersReport(warData);
    missBattlePlayers(warData);
    topPlayersRank(warData);
    

  }catch (error){
    console.log(chalk.red('error: \n'));
    console.log(error);
  }
})();

