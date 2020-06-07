export async function topDonationMember(data){
  let topDonationPlayer = false;

  for(let [tag, player] of Object.entries(data)){
    if ((player.role == 'Member') && (!topDonationPlayer || (player.donation > topDonationPlayer.donation))){
      topDonationPlayer = player;
    }
  }

  return topDonationPlayer;
}
