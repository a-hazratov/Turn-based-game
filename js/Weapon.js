/*Create weapon class*/
class Weapon extends Item {
    constructor(type, power){
        super('weapon/'+type+'.png');

        this.type=type;
        this.power=power;
    }
}