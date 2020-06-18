import chalk from 'chalk';

import FilterService from '../handlers/filterService.js';
import clanDataImporter from '../handlers/clanDataImporter.js';
import warDataImporter from '../handlers/warDataImporter.js';


export default class Scrapper {

    async fetchTopPlayerRank(warData){
        return FilterService.topPlayersRank(warData);        
    }

    async fetchInactiveMembersReport(warData){
        return FilterService.inactiveMembersReport(warData);
    }

    async fetchMissBattlePlayers(warData){
        return FilterService.missBattlePlayers(warData);
    }

    async fetchBestWinRate(warData){
        return FilterService.bestWinRate(warData);
    }

    async fetchTopDonationMember(warData){
        return FilterService.topDonationMember(warData);
    }

    async fetchTopDonation(warData){
        return FilterService.topDonation(warData);
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