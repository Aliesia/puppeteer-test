import chalk from 'chalk';
import emojize from 'node-emoji';

import inactiveMembersReport from '../handlers/inactiveReport.js'
import {missBattlePlayers, topPlayersRank, bestWinRate} from '../handlers/warBattlesReport.js'
import clanDataImporter from '../handlers/clanDataImporter.js'
import warDataImporter from '../handlers/warDataImporter.js'
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const emoji = emojize.emoji

let warData;

bot.on('message', async (msg) => {

    let response = '';
    let isInit = msg.text.toString().toLowerCase().indexOf('онови') === 0;

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
        '-показати гравця з найкращим рейтингом у клан війнах' + ' \n', {parse_mode : "HTML"}
        )
        
    } 

    if (isInit || msg.text.toString().toLowerCase().indexOf('топ') === 0) {
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

    if (isInit || msg.text.toString().toLowerCase().indexOf('пасивні') === 0) {
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

    if (isInit || msg.text.toString().toLowerCase().indexOf('пропустили') === 0) {
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

    if (isInit || msg.text.toString().toLowerCase().indexOf('обраний') === 0) {
        async function fetchBestWinRate(warData){
            let topPlayer = await bestWinRate(warData);

            if (topPlayer != false){
                return 'Гравець з найкращим рейтингом у клан війнах' + ' \n' + emoji.sunny + '=>' + '<b>' + topPlayer.name + ' [' + topPlayer.tag + ']' + '</b>' + ' \n';
            } 
            
            return 'Не знайдено достойного гравця' + emoji.cry + ' \n';
        }

        response = response + await fetchBestWinRate(warData);       
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
