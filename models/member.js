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
 get isNew(){
     return 'join_status' in this;
 }
 get isMiaStatus(){
     return 'mia' in this;
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
