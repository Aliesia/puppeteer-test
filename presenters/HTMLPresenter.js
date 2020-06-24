import emojize from 'node-emoji';

const emoji = emojize.emoji;

export default class HTMLResponsePresenter {
    hiResponse(msg){
        return `Привіт, ${msg.from.first_name}! ${emoji.wave} \n` +
        `<b>Команди в правому нижньому кутку з символом "/" :</b> \n` +
        `<b> /update </b> -оновити інформацію \n` +
        `<b> /top </b> -показати тих, що перемогли в 3х останніх кв \n` +
        `<b> /passive </b> -показати тих, що не зіграли в останніх 10 війнах \n` +
        `<b> /miss </b> -показати тих, що не зіграли в останніх 3х війнах \n` +
        `<b> /chosen </b> -показати гравця з найкращим рейтингом у клан війнах \n` +
        `<b> /donate </b> -показати новачка з найвищим донатом \n` +
        `<b> /donation </b> -показати гравця з найвищим донатом \n`;
    }

    bestWinRate(topPlayer) {
        if (topPlayer != false){
            return `Гравець з найкращим рейтингом у клан війнах це ${emoji.sunny} => \n<b>${topPlayer.introduce}</b> \n \n`;
        } 
        
        return `Не знайдено достойного гравця ${emoji.cry} \n`;
    }

    topPlayersRank(topBattleMembers){
        if (topBattleMembers.length != 0){
            return `Виграли у 3х останніх клан війнах ${emoji.confetti_ball} : \n<b>${topBattleMembers.join(' \n')}</b> \n` +
            `Всього: ${topBattleMembers.length} \n \n`;
        } 
    
        return `Шкода, але не вдалось знайти кандидатів на підвищення ${emoji.sad} \n \n`;
    }   

    inactiveMembersReport(inactiveMembers){
        if (inactiveMembers.length != 0){
            return `Не брали участь у 10 останніх кв ${emoji.scream} : \n<b>${inactiveMembers.join(' \n')}</b> \n` +
            `Всього: ${inactiveMembers.length} \n \n`;
        } 
        
        return `Прикинь, відсутні гравці, що взагалі не грали у кв! ${emoji.grinning} \n \n`;
    }

    missBattlePlayers(missBattleMembers){
        if (missBattleMembers.length != 0){
            return `Не взяли участь у 3х останніх кв ${emoji.angry} : \n<b>${missBattleMembers.join(' \n')}</b> \n` +
            `Всього: ${missBattleMembers.length} \n \n`;
        } 
        
        return `Здивувався, але прогулів у 3х останніх кв не знайшов ${emoji.sign_of_the_horns} \n \n`;
    }

    topDonationMember(topPlayer){
        return `Новачок з найкращим донатом це ${emoji.heart} => \n<b>${topPlayer.introduce} => ${topPlayer.donation}</b> ${emoji.moneybag} \n \n`;
    }

    topDonation(topPlayer){
        return `Найкращий донат зараз в клані у ${emoji.star} => \n<b>${topPlayer.introduce} => ${topPlayer.donation}</b> ${emoji.moneybag} \n \n`;
    }
}
