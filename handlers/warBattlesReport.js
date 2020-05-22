import chalk from 'chalk';

export async function missBattlePlayers(data){
    let missBattleMembers = [];

    for (let [key, value] of Object.entries(data)){
      if(value.lastBattlesScore == 0){
      missBattleMembers.push([value.name, value.tag, value.lastBattlesScore]);
      }
    }
    
    console.log(chalk.cyan('Players not participating in last 3 wars'));
    console.log(missBattleMembers);
    console.log(chalk.cyan('Total: ' + missBattleMembers.length));
  
    return missBattleMembers;
  }

export async function topPlayersRank(data){
    let topBattleMembers =[];

  for(let [key, value] of Object.entries(data)){
    if(value.lastBattlesScore > 32){
      topBattleMembers.push([value.name, value.tag, value.lastBattlesScore]);
    }
  }

    console.log(chalk.greenBright('Players win in last 3 wars'));
    console.log(topBattleMembers);
    console.log(chalk.greenBright('Total: ' + topBattleMembers.length));

    return topBattleMembers;
}

export async function bestWinRate(data){
  let topPlayer = false;

    for(let [tag, player] of Object.entries(data)){
      if((player.battlesCount > 7) && ( !topPlayer || (player.winRate > topPlayer.winRate))){
        topPlayer = player;
      }
    }
    
    console.log(chalk.white('Best player ever is ' + topPlayer.name))

    return topPlayer;
}