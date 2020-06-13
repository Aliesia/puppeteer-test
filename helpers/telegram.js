import chalk from 'chalk';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

import inactiveMembersReport from '../handlers/inactiveReport.js'
import {missBattlePlayers, topPlayersRank, bestWinRate} from '../handlers/warBattlesReport.js'
import {topDonationMember} from '../handlers/donationReport.js'
import clanDataImporter from '../handlers/clanDataImporter.js'
import warDataImporter from '../handlers/warDataImporter.js'
import HTMLResponsePresenter from '../presenters/HTMLPresenter.js'

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const presenter = new HTMLResponsePresenter();

let warData;

const CMD_MSG_UPDATE = 'update';
const CMD_MSG_TOP = 'top';
const CMD_MSG_PASSIVE = 'passive';
const CMD_MSG_MISS = 'miss';
const CMD_MSG_CHOSEN = 'chosen';
const CMD_MSG_DONATE = 'donate';

const COMMANDS_LIST = [
    {
        command: CMD_MSG_UPDATE,
        description: 'оновити інформацію'
    },
    {
        command: CMD_MSG_TOP,
        description: 'перемогли в 3х останніх кв'
    },
    {
        command: CMD_MSG_PASSIVE,
        description: 'не зіграли в останніх 10 війнах'
    },
    {
        command: CMD_MSG_MISS,
        description: 'пропустили останніх 3х війни'
    },
    {
        command: CMD_MSG_CHOSEN,
        description: 'найкращий рейтинг в клан війні '
    },
    {
        command: CMD_MSG_DONATE,
        description: 'найвищий донат за тиждень '
    },
]


bot.on('message', async (msg) => {
    bot.setMyCommands(COMMANDS_LIST);
    let response = '';
    let isInit = msg.text.toString().toLowerCase().indexOf(CMD_MSG_UPDATE) === 1;

    if (isInit) {
        await bot.sendMessage(msg.chat.id,'Оновлюю інформацію ...');
        warData = await getData();
        response = response + 'Оновлено!' + ' \n' + ' \n';
    } 

    if (msg.text.toString().toLowerCase().indexOf('хай') === 0) {
        await bot.sendMessage(msg.chat.id, presenter.hiResponse(msg), {parse_mode : "HTML"})
    } 

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_TOP) === 1) {
        async function fetchTopPlayerRank(warData){
            let topBattleMembers = await topPlayersRank(warData);
            
            return presenter.topPlayersRank(topBattleMembers);
        }

        response = response + await fetchTopPlayerRank(warData);
    }

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_PASSIVE) === 1) {
        async function fetchInactiveMembersReport(warData){
            let inactiveMembers = await inactiveMembersReport(warData);
            
            return presenter.inactiveMembersReport(inactiveMembers);
        }

        response = response + await fetchInactiveMembersReport(warData);
    }

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_MISS) === 1) {
        async function fetchMissBattlePlayers(warData){
            let missBattleMembers = await missBattlePlayers(warData);
            
            return presenter.missBattlePlayers(missBattleMembers);
        }

        response = response + await fetchMissBattlePlayers(warData); 
    }

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_CHOSEN) === 1) {
        async function fetchBestWinRate(warData){
            let topPlayer = await bestWinRate(warData);
            
            return presenter.bestWinRate(topPlayer);
        }

        response = response + await fetchBestWinRate(warData);       
    }

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_DONATE) === 1){
        async function fetchTopDonationMember(warData){
            let topPlayer = await topDonationMember(warData);
            
            return presenter.topDonationMember(topPlayer);
        }

        response = response + await fetchTopDonationMember(warData); 
    }

    if (response === ''){
        return;
    } 

    return bot.sendMessage(msg.chat.id, response, {parse_mode : "HTML"});
});

async function getData(){
    try{
        let clanMembers = await clanDataImporter();

        return warDataImporter(clanMembers);
      }catch (error){
        console.log(chalk.red('error: \n'));
        console.log(error);
      }
}
