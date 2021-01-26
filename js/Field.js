
function draw () {
    let posX=0;
    let posY=0;
    for (let i = 0; i < gameMap.length; i++) {
        for (let j = 0; j < gameMap[i].length; j++) {
            if (gameMap[i][j]==0) {
                context.fillStyle='#778899';
                context.strokeRect(posX, posY, 36, 36);

                context.fillRect(posX, posY, 35, 35);


            }
            // Create obstacles
            if (gameMap[i][j]==1) {
                context.fillStyle='#D2691E';
                context.strokeRect(posX, posY, 36, 36);

                context.fillRect(posX, posY, 35, 35);
            }
            // Place weapons
            if(gameMap[i][j] instanceof Weapon){
                gameMap[i][j].place(posX/36, posY/36);
            }

            posX+=36;
        }
        posX=0;
        posY+=36;
    }
}
