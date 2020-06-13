import chalk from 'chalk';

import {missBattlePlayers, topPlayersRank, bestWinRate} from '../handlers/warBattlesReport.js';
import inactiveMembersReport from '../handlers/inactiveReport.js';
import {topDonationMember} from '../handlers/donationReport.js';
import clanDataImporter from '../handlers/clanDataImporter.js';
import warDataImporter from '../handlers/warDataImporter.js';

export default class Scrapper {
    async fetchTopPlayerRank(warData){
        return topPlayersRank(warData);        
    }

    async fetchInactiveMembersReport(warData){
        return inactiveMembersReport(warData);
    }

    async fetchMissBattlePlayers(warData){
        return missBattlePlayers(warData);
    }

    async fetchBestWinRate(warData){
        return bestWinRate(warData);
    }

    async fetchTopDonationMember(warData){
        return topDonationMember(warData);
    }

    async getData(){
        try{
            let clanMembers = await clanDataImporter();
    
            return warDataImporter(clanMembers);
          }catch (error){
            console.log(chalk.red('error: \n'));
            console.log(error);
          }
    }

}