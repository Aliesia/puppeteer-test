import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

import HTMLResponsePresenter from '../presenters/HTMLPresenter.js'
import scrapper from '../handlers/scrapper.js'

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const presenter = new HTMLResponsePresenter();
const SCRAPPER = new scrapper();

let warData;

const CMD_MSG_UPDATE = 'update';
const CMD_MSG_TOP = 'top';
const CMD_MSG_PASSIVE = 'passive';
const CMD_MSG_MISS = 'miss';
const CMD_MSG_CHOSEN = 'chosen';
const CMD_MSG_DONATE = 'donate';
const CMD_MSG_BEST_DONATE = 'donation';
const CMD_MSG_MISSED_COLLECTING = 'collection';

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
    {
        command: CMD_MSG_BEST_DONATE,
        description: 'найвищий донат за тиждень '
    },
    {
        command: CMD_MSG_MISSED_COLLECTING,
        description: 'пропустив збір карт на кв '
    }
    
]


bot.on('message', async (msg) => {
    function isCommand(command){
        return msg.text.toString().toLowerCase().indexOf(command) === 1;
    }
    function isMessage(message){
        return msg.text.toString().toLowerCase().indexOf(message) === 0;
    }
    bot.setMyCommands(COMMANDS_LIST);
    let response = '';
    let isInit = isCommand(CMD_MSG_UPDATE);

    if (isInit) {
        await bot.sendMessage(msg.chat.id,'Оновлюю інформацію ...');
        warData = await SCRAPPER.getData();
        response = response + 'Оновлено!' + ' \n' + ' \n';
    } 

    if (isMessage('хай')) {
        await bot.sendMessage(msg.chat.id, presenter.hiResponse(msg), {parse_mode : "HTML"})
    } 

    if (isInit || isCommand(CMD_MSG_TOP)) {
        response = response + presenter.topPlayersRank(await SCRAPPER.fetchTopPlayerRank(warData));
    }

    if (isInit || isCommand(CMD_MSG_PASSIVE)) {
        response = response + presenter.inactiveMembersReport(await SCRAPPER.fetchInactiveMembersReport(warData));
    }

    if (isInit || isCommand(CMD_MSG_MISS)) {
        response = response + presenter.missBattlePlayers(await SCRAPPER.fetchMissBattlePlayers(warData)); 
    }

    if (isInit || isCommand(CMD_MSG_CHOSEN)) {
        response = response + presenter.bestWinRate(await SCRAPPER.fetchBestWinRate(warData));       
    }

    if (isInit || isCommand(CMD_MSG_DONATE)){
        response = response + presenter.topDonationMember(await SCRAPPER.fetchTopDonationMember(warData)); 
    }

    if (isInit || isCommand(CMD_MSG_BEST_DONATE)){
        response = response + presenter.topDonation(await SCRAPPER.fetchTopDonation(warData)); 
    }

    if (isInit || isCommand(CMD_MSG_MISSED_COLLECTING)){
        response = response + presenter.missedCollectingCard(await SCRAPPER.fetchMissedCollectingCard(warData)); 
    }

    if (response === ''){
        return;
    } 

    return bot.sendMessage(msg.chat.id, response, {parse_mode : "HTML"});
});
