export async function topDonationMember(data){
  let topDonationPlayer = false;

  for(let [tag, player] of Object.entries(data)){
    if (player.isRoleMember && (!topDonationPlayer || (player.donation > topDonationPlayer.donation))){
      topDonationPlayer = player;
    }
  }

  return topDonationPlayer;
}

export async function topDonation(data){
  let topDonationPlayer = false;

  for(let [tag, player] of Object.entries(data)){
    if ((!topDonationPlayer || (player.donation > topDonationPlayer.donation))){
      topDonationPlayer = player;
    }
  }

  return topDonationPlayer;
}
