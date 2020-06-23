import importService from '../handlers/importSevice.js'

export default class Member {
 constructor(options){
    this.role = options.role,
    this.name = options.name,
    this.tag = options.tag,
    this.donation = options.donation
 }
 get introduce(){
     return this.name + ' [' + this.tag + '] '
 }
 get hasJoinStatus(){
     return 'join_status' in this;
 }
 async isNew(){
        return this.isNewMember();
 }
 async isNewMember() {
    let d = new Date();
    let short_ts = await importService.userClanHistoryImporter(this);
    let playerDay = short_ts.replace(/06-/g, "");
    
    for (var i = 1; i<=5; i++) {
        if(playerDay == d.getDate()){
            return true;
        }
    
        d.setDate(d.getDate() - 1);
    }

    return false; 
 }
 get isMiaStatus(){
     return 'mia' in this;
 }
 get isOnWarList(){
     return this.isMiaStatus;
 }
 get isRoleMember(){
     return this.role == 'Member';
 }
 get hasMissedBattle(){
     return this.lastBattlesScore == 0;
 }
 get isTopPlayer(){
     return this.lastBattlesScore > 32;
 }
 get hasMinBattleQuantity(){
     return this.battlesCount > 7;
 }
}
