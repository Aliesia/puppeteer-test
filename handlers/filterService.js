export default class FilterService {

    static inactiveMembersReport(data){
        let inactiveMembers = []
      
        for (let [key, member] of Object.entries(data)){
            if(!member.isMiaStatus && !member.isNew){
              inactiveMembers.push([member.introduce]);
            }
        }
      
        return inactiveMembers;
      }

    static missBattlePlayers(data){
        let missBattleMembers = [];
      
        for (let [key, value] of Object.entries(data)){
          if(value.hasMissedBattle){
            missBattleMembers.push([value.introduce]);
          }
        }
        
        return missBattleMembers;
      }
      
    static topPlayersRank(data){
        let topBattleMembers = [];
      
        for(let [key, value] of Object.entries(data)){
          if(value.isTopPlayer){
            topBattleMembers.push([value.introduce]);
          }
        }
      
        return topBattleMembers;
      }
      
    static bestWinRate(data){
        let topPlayer = false;
      
        for(let [tag, player] of Object.entries(data)){
          if(player.hasMinBattleQuantity && ( !topPlayer || (player.winRate > topPlayer.winRate))){
            topPlayer = player;
          }
        }
      
        return topPlayer;
      }

    static topDonationMember(data){
        let topDonationPlayer = false;
      
        for(let [tag, player] of Object.entries(data)){
          if (player.isRoleMember && (!topDonationPlayer || (player.donation > topDonationPlayer.donation))){
            topDonationPlayer = player;
          }
        }
      
        return topDonationPlayer;
      }
      
    static topDonation(data){
        let topDonationPlayer = false;
      
        for(let [tag, player] of Object.entries(data)){
          if ((!topDonationPlayer || (player.donation > topDonationPlayer.donation))){
            topDonationPlayer = player;
          }
        }
      
        return topDonationPlayer;
      }
      
}
