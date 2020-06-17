export async function missBattlePlayers(data){
  let missBattleMembers = [];

  for (let [key, value] of Object.entries(data)){
    if(value.hasMissedBattle){
      missBattleMembers.push([value.introduce]);
    }
  }
  
  return missBattleMembers;
}

export async function topPlayersRank(data){
  let topBattleMembers = [];

  for(let [key, value] of Object.entries(data)){
    if(value.isTopPlayer){
      topBattleMembers.push([value.introduce]);
    }
  }

  return topBattleMembers;
}

export async function bestWinRate(data){
  let topPlayer = false;

  for(let [tag, player] of Object.entries(data)){
    if(player.hasMinBattleQuantity && ( !topPlayer || (player.winRate > topPlayer.winRate))){
      topPlayer = player;
    }
  }

  return topPlayer;
}
