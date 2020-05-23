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
        await bot.sendMessage(msg.chat.id,'Привіт ' + msg.from.first_name + emoji.wave + ' \n ' + 
        'Доступні команди:' + ' \n ' + 
        '<b> топ </b>' + ' \n ' +
        '-показати тих, що перемогли в 3х останніх кв' + ' \n ' +
        '<b> пасивні </b> ' + ' \n ' + 
        '-показати тих, що не зіграли в останніх 10 війнах' + ' \n ' +
        '<b> пропустили </b> ' + ' \n ' + 
        '-показати тих, що не зіграли в останніх 3х війнах' + ' \n ' +
        '<b> обраний </b> ' + ' \n ' + 
        '-показати гравця з найкращим рейтингом у клан війнах' + ' \n ', {parse_mode : "HTML"}
        )
        
    } 

    if (msg.text.toString().toLowerCase().indexOf('топ') === 0) {
        let topBattleMembers = await topPlayersRank(warData);
        await bot.sendMessage(msg.chat.id,'Players win in last 3 wars' + emoji.confetti_ball);
        await bot.sendMessage(msg.chat.id, topBattleMembers.join(' \n '));
        await bot.sendMessage(msg.chat.id,'Total: ' + topBattleMembers.length);
    } 
    
    if (msg.text.toString().toLowerCase().indexOf('пасивні') === 0) {
        let inactiveMembers = await inactiveMembersReport(warData);
        await bot.sendMessage(msg.chat.id,'Players without participation in last 10 wars' + emoji.crying_cat_face);
        await bot.sendMessage(msg.chat.id, inactiveMembers.join(' \n '));
        await bot.sendMessage(msg.chat.id,'Total: ' + inactiveMembers.length);
    } 

    if (msg.text.toString().toLowerCase().indexOf('пропустили') === 0) {
        let missBattleMembers = await missBattlePlayers(warData);
        await bot.sendMessage(msg.chat.id,'Players not participating in last 3 wars' + emoji.angry);
        await bot.sendMessage(msg.chat.id, missBattleMembers.join(' \n '));
        await bot.sendMessage(msg.chat.id,'Total: ' + missBattleMembers.length);
    } 

    if (msg.text.toString().toLowerCase().indexOf('обраний') === 0) {
        let topPlayer = await bestWinRate(warData);
        await bot.sendMessage(msg.chat.id,'Best player ever is ' + topPlayer.name + emoji.heart);
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
