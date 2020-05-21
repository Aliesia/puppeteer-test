import chalk from 'chalk';

export default async function warBattlesReport(data){
    let missBattleMembers = [];
    let topBattleMembers =[];

    for (let [key, value] of Object.entries(data)){
      if(value.lastBattlesScore == 0){
      missBattleMembers.push([value.name, value.tag, value.lastBattlesScore]);
      }
      if(value.lastBattlesScore > 32){
        topBattleMembers.push([value.name, value.tag, value.lastBattlesScore]);
      }
    }
      
    
    
    console.log(chalk.cyan('Players not participating in last 3 wars'));
    console.log(missBattleMembers);
    console.log(chalk.cyan('Total: ' + missBattleMembers.length));
    console.log(chalk.greenBright('Players win in last 3 wars'));
    console.log(topBattleMembers);
    console.log(chalk.greenBright('Total: ' + topBattleMembers.length));
  
    return missBattleMembers;

  }
  