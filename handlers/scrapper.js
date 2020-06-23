import chalk from 'chalk';

import FilterService from '../handlers/filterService.js';
import ImportService from '../handlers/importSevice.js';

export default class Scrapper {

    async fetchTopPlayerRank(warData){
        return FilterService.topPlayersRank(warData);        
    }

    async fetchInactiveMembersReport(warData){
        return await FilterService.inactiveMembersReport(warData);
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
            let clanMembers = await ImportService.clanDataImporter();
    
            return ImportService.warDataImporter(clanMembers);
          }catch (error){
            console.log(chalk.red('error: \n'));
            console.log(error);
          }
    }

}