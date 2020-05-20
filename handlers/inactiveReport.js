import chalk from 'chalk';

export default async function inactiveMembersReport(data){
    let inactiveMembers = []
  
    for (let [key, value] of Object.entries(data)){
        if(!('mia' in value) && !('join_status' in value)){
          inactiveMembers.push(value.name);
        }
    }
    
    console.log(chalk.magenta('Players without participation in last 10 wars'));
    console.log(inactiveMembers);
    console.log(chalk.magenta('Total: ' + inactiveMembers.length));
  
    return inactiveMembers;
  }
  