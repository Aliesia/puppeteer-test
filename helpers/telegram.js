import chalk from 'chalk';
import emojize from 'node-emoji';

import inactiveMembersReport from '../handlers/inactiveReport.js'
import {missBattlePlayers, topPlayersRank, bestWinRate} from '../handlers/warBattlesReport.js'
import {topDonationMember} from '../handlers/donationReport.js'
import clanDataImporter from '../handlers/clanDataImporter.js'
import warDataImporter from '../handlers/warDataImporter.js'
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const emoji = emojize.emoji;

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
        await bot.sendMessage(msg.chat.id,'Привіт ' + msg.from.first_name + emoji.wave + ' \n' + 
        'Доступні команди:' + ' \n' + 
        '<b> топ </b>' + ' \n' +
        '-показати тих, що перемогли в 3х останніх кв' + ' \n' +
        '<b> пасивні </b> ' + ' \n' + 
        '-показати тих, що не зіграли в останніх 10 війнах' + ' \n' +
        '<b> пропустили </b> ' + ' \n' + 
        '-показати тих, що не зіграли в останніх 3х війнах' + ' \n' +
        '<b> обраний </b> ' + ' \n' + 
        '-показати гравця з найкращим рейтингом у клан війнах' + ' \n'+
        '<b> донат </b> ' + ' \n' + 
        '-показати гравця з найвищим донатом за тиждень' + ' \n', {parse_mode : "HTML"}
        )
        
    } 

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_TOP) === 1) {
        async function fetchTopPlayerRank(warData){
            let topBattleMembers = await topPlayersRank(warData);

            if (topBattleMembers.length != 0){
                return 'Виграли у 3х останніх клан війнах' + emoji.confetti_ball + ':' + ' \n'+
                topBattleMembers.join(' \n') + ' \n' + 
                '<b>Всього:</b> ' + topBattleMembers.length + ' \n' + ' \n';
            } 

            return 'Шкода, але не вдалось знайти кандидатів на підвищення' + emoji.sad + ' \n' + ' \n';
        }   

        response = response + await fetchTopPlayerRank(warData);
    }

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_PASSIVE) === 1) {
        async function fetchInactiveMembersReport(warData){
            let inactiveMembers = await inactiveMembersReport(warData);
        
            if (inactiveMembers.length != 0){
                return 'Не брали участь у 10 останніх кв' + emoji.scream + ':' + ' \n' +
                inactiveMembers.join(' \n') + ' \n' + 
                '<b>Всього: </b> '  + inactiveMembers.length + ' \n' + ' \n';
            } 
            
            return 'Прикинь, відсутні гравці, що взагалі не грали у кв! ' + emoji.grinning + ' \n' + ' \n';
        }

        response = response + await fetchInactiveMembersReport(warData);
    }

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_MISS) === 1) {
        async function fetchMissBattlePlayers(warData){
            let missBattleMembers = await missBattlePlayers(warData);

            if (missBattleMembers.length != 0){
                return 'Не взяли участь у 3х останніх кв' + emoji.angry + ':' + ' \n' +
                missBattleMembers.join(' \n') + ' \n' + 
                '<b>Всього:</b> '  + missBattleMembers.length + ' \n' + ' \n';
            } 
            
            return 'Здивувався, але прогулів у 3х останніх кв не знайшов' + emoji.sign_of_the_horns + ' \n' + ' \n';
        }

        response = response + await fetchMissBattlePlayers(warData); 
    }

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_CHOSEN) === 1) {
        async function fetchBestWinRate(warData){
            let topPlayer = await bestWinRate(warData);

            if (topPlayer != false){
                return 'Гравець з найкращим рейтингом у клан війнах' + ' \n' + emoji.sunny + '=>' + '<b>' + topPlayer.name + ' [' + topPlayer.tag + ']' + '</b>' + ' \n';
            } 
            
            return 'Не знайдено достойного гравця' + emoji.cry + ' \n';
        }

        response = response + await fetchBestWinRate(warData);       
    }

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_DONATE) === 1){
        async function fetchTopDonationMember(warData){
            let topPlayer = await topDonationMember(warData);

            return ' \n' + 'Новачок з найкращим донатом' + ' \n' + emoji.heart + '=>' + '<b>' + topPlayer.name + ' [' + topPlayer.tag + '] ' + topPlayer.donation + '</b>' + ' \n';
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

        inactiveMembersReport(warData);
        missBattlePlayers(warData);
        topPlayersRank(warData);
        bestWinRate(warData);
        
    
      }catch (error){
        console.log(chalk.red('error: \n'));
        console.log(error);
      }

}
