
/*Create a player class*/
class Player {
    constructor(id)
    {
        this.id = id;
        this.canvasId = 'canvas';
        this.X=null;
        this.Y=null;
        this.canvas=document.getElementById(this.canvasId);
        this.canvasInfo=this.canvas.getContext("2d");
        this.imageSrc = "player_"+ this.id +".png";
        this.weapons = [];
        this.health = 0;
        this.power = 0;
        this.isDefend = false;
        this.reset();
    }

    getWeapon()
    {
        for(let i =0; i < this.weapons.length; i++){
            if(this.weapons[i].type !== 'shield'){
                return this.weapons[i];

            }
        }
        return false;
    }


    drawImg()
    {
        let _this=this;
        this.image = new Image();
        this.image.src = this.imageSrc;

        this.image.onload = function() {
            context.drawImage(_this.image, _this.X * 36, _this.Y * 36);
        }
    };

    collectWeapon(weapon)
    {
        for(let i = 0; i < this.weapons.length; i++ ){
            if(weapon.type !== 'shield' && this.weapons[i].type !== 'shield'){
                gameMap[this.Y][this.X] = this.weapons[i];

                this.power -= this.weapons[i].power;
                this.weapons.splice(i, 1);
            }
        }

        this.weapons.push(weapon);
        if(weapon.type == 'shield'){
            this.health += weapon.power;
        }else {
            this.power += weapon.power;
        }
        this.updateCounter();
    }

    applyShield()
    {
        this.isDefend = true;
    }

    reset()
    {
        this.health = 100;
        this.power = 0;

        this.weapons = [];
        this.collectWeapon(new Weapon('knife', 10));
    }

    updateCounter()
    {

        $("#player"+this.id+" .health").html(this.health < 0 ? 0 : this.health);
        $("#player"+this.id+" .weapons").html('');
        for(let i = 0; i < this.weapons.length; i++ ){
            let weaponImg = $('<img>').attr('src', 'weapon/'+this.weapons[i].type + '.png');
            $("#player"+this.id+" .weapons").append(weaponImg);
        }
    }
    attack(enemy)
    {
        let applyDamage = this.getWeapon().power;
        if(enemy.isDefend){
            applyDamage *= 0.5;
        }
        enemy.health = enemy.health - applyDamage;
        enemy.isDefend = false;
        enemy.updateCounter();
    }
}


/*Function to highlight the cells for the next move*/
function drawHighlightedCell(posX, posY){
    posX*=36;
    posY*=36;
    context.fillStyle='#A9A9A9';
    context.strokeRect(posX, posY, 36, 36);
    context.fillRect(posX, posY, 35, 35);
}


/*Identify and  Highlight cells for active players*/
function highlightAllCells(playerToHighlight, opponent){
    movePermission=[];

    let coef = [{col: 1, row: 0}, {col: 0, row: 1}, {col: 0, row: -1}, {col: -1, row: 0} ];
    for(i=0; i<=3; i++){
        for(j=1; j<=3; j++){
            let rowIndex = playerToHighlight.X+coef[i].row*j;
            let colIndex = playerToHighlight.Y+coef[i].col*j;
            let isInRange = rowIndex >=0 && colIndex>=0 && rowIndex<=15 && colIndex <=15;

            if (isInRange && gameMap[colIndex][rowIndex] == 1 || (opponent.X==rowIndex && opponent.Y==colIndex)){
                break;
            }else if(isInRange){
                drawHighlightedCell(rowIndex, colIndex);
                movePermission.push({row:rowIndex, col:colIndex});
            }
        }
    }
}