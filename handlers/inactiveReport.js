export default async function inactiveMembersReport(data){
    let inactiveMembers = []
  
    for (let [key, value] of Object.entries(data)){
        if(!('mia' in value) && !('join_status' in value)){
          inactiveMembers.push([value.name, value.tag]);
        }
    }
  
    return inactiveMembers;
  }
  