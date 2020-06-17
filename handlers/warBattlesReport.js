export async function missBattlePlayers(data){
  const BATTLE_SCORE_ABSENT = 0;
  let missBattleMembers = [];

  for (let [key, value] of Object.entries(data)){
    if(value.lastBattlesScore == BATTLE_SCORE_ABSENT){
    missBattleMembers.push([value.introduce]);
    }
  }
  
  return missBattleMembers;
}

export async function topPlayersRank(data){
  const BATTLE_SCORE_UNSUCCESS_COUNT = 32;
  let topBattleMembers =[];

  for(let [key, value] of Object.entries(data)){
    if(value.lastBattlesScore > BATTLE_SCORE_UNSUCCESS_COUNT){
      topBattleMembers.push([value.introduce]);
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
