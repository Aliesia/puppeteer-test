export async function missBattlePlayers(data){
    let missBattleMembers = [];

    for (let [key, value] of Object.entries(data)){
      if(value.lastBattlesScore == 0){
      missBattleMembers.push([value.name + ' [' + value.tag + ']']);
      }
    }
  
    return missBattleMembers;
  }

export async function topPlayersRank(data){
    let topBattleMembers =[];

  for(let [key, value] of Object.entries(data)){
    if(value.lastBattlesScore > 32){
      topBattleMembers.push([value.name + ' [' + value.tag + ']']);
    }
  }

    return topBattleMembers;
}

export async function bestWinRate(data){
  let topPlayer = false;

    for(let [tag, player] of Object.entries(data)){
      if((player.battlesCount > 7) && ( !topPlayer || (player.winRate > topPlayer.winRate))){
        topPlayer = player;
      }
    }

    return topPlayer;
}
