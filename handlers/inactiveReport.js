export default async function inactiveMembersReport(data){
    let inactiveMembers = []
  
    for (let [key, member] of Object.entries(data)){
        if(!member.isMiaStatus && !member.isNew){
          inactiveMembers.push([member.introduce]);
        }
    }
  
    return inactiveMembers;
  }
  