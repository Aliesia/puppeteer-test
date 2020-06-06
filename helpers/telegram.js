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

    if (msg.text.toString().toLowerCase().indexOf('онови') === 0) {
        await bot.sendMessage(msg.chat.id,'Оновлюю інформацію ...');
        warData = await getData();
        await bot.sendMessage(msg.chat.id,'Оновлено!');
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

    if (msg.text.toString().toLowerCase().indexOf('топ') === 0) {
        let topBattleMembers = await topPlayersRank(warData);
        if (topBattleMembers.length != 0){
            let topBattleMembers = await topPlayersRank(warData);
            await bot.sendMessage(msg.chat.id,'Гравці, які виграли у 3х останніх клан війнах' + emoji.confetti_ball + ':' + ' \n' + ' \n'+
            topBattleMembers.join(' \n') + ' \n' + 
            '<b>Всього:</b> ' + topBattleMembers.length, {parse_mode : "HTML"});
        } else {
            await bot.sendMessage(msg.chat.id,'Шукав усюди, але не вдалось знайти жодного такого гравця' + emoji.sad)
        }
    }

    
    if (msg.text.toString().toLowerCase().indexOf('пасивні') === 0) {
        let inactiveMembers = await inactiveMembersReport(warData);
        if (inactiveMembers.length != 0){
            await bot.sendMessage(msg.chat.id,'Гравці, які не брали участь у 10 останніх кв' + emoji.scream + ':' +' \n' + ' \n' +
            inactiveMembers.join(' \n') + ' \n' + 
            '<b>Всього: </b> '  + inactiveMembers.length, {parse_mode : "HTML"});
        } else {
            await bot.sendMessage(msg.chat.id,'Ура! Не знайдено жодного такого гравця!' + emoji.grinning)
        }
    }

    if (msg.text.toString().toLowerCase().indexOf('пропустили') === 0) {
        let missBattleMembers = await missBattlePlayers(warData);
        if (missBattleMembers.length != 0){
            await bot.sendMessage(msg.chat.id,'Гравці, які не взяли участь у 3х останніх кв' + emoji.angry + ':' + ' \n' + ' \n' +
            missBattleMembers.join(' \n') + ' \n' + 
            '<b>Всього:</b> '  + missBattleMembers.length, {parse_mode : "HTML"});
        } else {
            await bot.sendMessage(msg.chat.id,'Здивувався, але не знайшов жодного такого гравця' + emoji.sign_of_the_horns)
        }
    }

    if (msg.text.toString().toLowerCase().indexOf('обраний') === 0) {
        let topPlayer = await bestWinRate(warData);
        if (topPlayer != false){
            await bot.sendMessage(msg.chat.id,'Гравець з найкращим рейтингом у клан війнах' + emoji.sunny + '=>' + ' \n' + '<b>' + topPlayer.name +'</b>', {parse_mode : "HTML"});
        } else{
            await bot.sendMessage(msg.chat.id,'Не знайдено достойного гравця' + emoji.cry)
        }
    } 
    
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
