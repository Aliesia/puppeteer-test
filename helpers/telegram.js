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
        warData = await SCRAPPER.getData();
        response = response + 'Оновлено!' + ' \n' + ' \n';
    } 

    if (msg.text.toString().toLowerCase().indexOf('хай') === 0) {
        await bot.sendMessage(msg.chat.id, presenter.hiResponse(msg), {parse_mode : "HTML"})
    } 

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_TOP) === 1) {
        response = response + presenter.topPlayersRank(await SCRAPPER.fetchTopPlayerRank(warData));
    }

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_PASSIVE) === 1) {
        response = response + presenter.inactiveMembersReport(await SCRAPPER.fetchInactiveMembersReport(warData));
    }

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_MISS) === 1) {
        response = response + presenter.missBattlePlayers(await SCRAPPER.fetchMissBattlePlayers(warData)); 
    }

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_CHOSEN) === 1) {
        response = response + presenter.bestWinRate(await SCRAPPER.fetchBestWinRate(warData));       
    }

    if (isInit || msg.text.toString().toLowerCase().indexOf(CMD_MSG_DONATE) === 1){
        response = response + presenter.topDonationMember(await SCRAPPER.fetchTopDonationMember(warData)); 
    }

    if (response === ''){
        return;
    } 

    return bot.sendMessage(msg.chat.id, response, {parse_mode : "HTML"});
});
