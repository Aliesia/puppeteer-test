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
}