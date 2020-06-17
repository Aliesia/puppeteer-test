export default async function inactiveMembersReport(data){
    let inactiveMembers = []
  
    for (let [key, member] of Object.entries(data)){
        if(!('mia' in member) && !('join_status' in member)){
          inactiveMembers.push([member.introduce]);
        }
    }
  
    return inactiveMembers;
  }
  