import emojize from 'node-emoji';

const emoji = emojize.emoji;

export default class HTMLResponsePresenter {
    hiResponse(msg){
        return 'Привіт ' + msg.from.first_name + emoji.wave + ' \n' + 
        'Доступні команди в правому нижньому кутку з символом "/":' + ' \n' + 
        '<b> /update </b>' + ' \n' +
        '-оновити інформацію' + ' \n' +
        '<b> /top </b>' + ' \n' +
        '-показати тих, що перемогли в 3х останніх кв' + ' \n' +
        '<b> /passive </b> ' + ' \n' + 
        '-показати тих, що не зіграли в останніх 10 війнах' + ' \n' +
        '<b> /miss </b> ' + ' \n' + 
        '-показати тих, що не зіграли в останніх 3х війнах' + ' \n' +
        '<b> /chosen </b> ' + ' \n' + 
        '-показати гравця з найкращим рейтингом у клан війнах' + ' \n'+
        '<b> /donate </b> ' + ' \n' + 
        '-показати новачка з найвищим донатом' + ' \n'+
        '<b> /donation </b> ' + ' \n' + 
        '-показати гравця з найвищим донатом' + ' \n';
    }

    bestWinRate(topPlayer) {
        if (topPlayer != false){
            return 'Гравець з найкращим рейтингом у клан війнах' + ' \n' + emoji.sunny + '=>' + '<b>' + topPlayer.introduce + '</b>' + ' \n';
        } 
        
        return 'Не знайдено достойного гравця' + emoji.cry + ' \n';
    }

    topPlayersRank(topBattleMembers){
        if (topBattleMembers.length != 0){
            return 'Виграли у 3х останніх клан війнах' + emoji.confetti_ball + ':' + ' \n'+
            topBattleMembers.join(' \n') + ' \n' + 
            '<b>Всього:</b> ' + topBattleMembers.length + ' \n' + ' \n';
        } 
    
        return 'Шкода, але не вдалось знайти кандидатів на підвищення' + emoji.sad + ' \n' + ' \n';
    }   

    inactiveMembersReport(inactiveMembers){
        if (inactiveMembers.length != 0){
            return 'Не брали участь у 10 останніх кв' + emoji.scream + ':' + ' \n' +
            inactiveMembers.join(' \n') + ' \n' + 
            '<b>Всього: </b> '  + inactiveMembers.length + ' \n' + ' \n';
        } 
        
        return 'Прикинь, відсутні гравці, що взагалі не грали у кв! ' + emoji.grinning + ' \n' + ' \n';
    }

    missBattlePlayers(missBattleMembers){
        if (missBattleMembers.length != 0){
            return 'Не взяли участь у 3х останніх кв' + emoji.angry + ':' + ' \n' +
            missBattleMembers.join(' \n') + ' \n' + 
            '<b>Всього:</b> '  + missBattleMembers.length + ' \n' + ' \n';
        } 
        
        return 'Здивувався, але прогулів у 3х останніх кв не знайшов' + emoji.sign_of_the_horns + ' \n' + ' \n';
    }

    topDonationMember(topPlayer){
        return ' \n' + 'Новачок з найкращим донатом' + ' \n' + emoji.heart + '=>' + '<b>' + topPlayer.introduce + ' ' + topPlayer.donation + '</b>' + ' \n';
    }

    topDonation(topPlayer){
        return ' \n' + 'Найкращий донат зараз в клані у ' + ' \n' + '<b>' + topPlayer.introduce + '=>' + topPlayer.donation + '</b>' + emoji.moneybag + ' \n';
    }
}
