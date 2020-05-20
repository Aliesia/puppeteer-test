import chalk from 'chalk';

export default async function inactiveMembersReport(memberList){
    let inactiveMembers = []
  
    for (let [tag, member] of Object.entries(memberList)){
        if(!('mia' in member) && !('join_status' in member)){
          inactiveMembers.push(member.name);
        }
    }
    
    console.log(chalk.magenta('Players without participation in last 10 wars'));
    console.log(inactiveMembers);
    console.log(chalk.magenta('Total: ' + inactiveMembers.length));
  
    return inactiveMembers;
  }
  