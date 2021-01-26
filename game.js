//JS file

const canvas = document.getElementById('canvas');
context = canvas.getContext('2d');


let gameMap = [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
];

let movePermission =[];
/*Create actual players by using the player class*/
let player1 = new Player(1);
let player2 = new Player(2);

/*Player movements on the board taking turns*/
let isPlayer1Turn=true;

/*Get the start button and add an event listener for the button */
let startGameButton = document.getElementById('start-game');

let gameMode = false;


/*Function to get an array index - which tile is clicked*/
function getArrayIndex(pixelValue) {
	var tileSize = 36;
	var tileIndex = Math.floor(pixelValue/tileSize);
	return tileIndex;
	console.log(tileIndex);
}
    // Restricting movements
function isMoveAllowed(indexX, indexY){
    for(let i=0; i<movePermission.length; i++){
        if(movePermission[i].row == indexX && movePermission[i].col == indexY){
            return true
        }
    }
    return false;
};

/*Generate random number)*/
const generateRandomPosition=()=> Math.floor(Math.random()*16);
const generateRandomNumber=(min, max)=> Math.floor(min + Math.random()*(max-min+1));



 //Movements on the field
canvas.addEventListener('click', (event) => {
	    // Get index numbers from pixel values
	let indexX = getArrayIndex(event.offsetX);
	let indexY = getArrayIndex(event.offsetY);
    console.log('X: ' + getArrayIndex(event.offsetX) + ' | Y: ' + getArrayIndex(event.offsetY));
    if(isMoveAllowed(indexX, indexY) && gameMode == 'move'){

        draw();

        //Move player
		if (isPlayer1Turn) {
			player1.X = indexX;
			player1.Y = indexY;
		}else{
			player2.X=indexX;
			player2.Y=indexY;
		}

		//Collect weapon
		if(gameMap[indexY][indexX] instanceof Weapon){
			if(isPlayer1Turn){
				player1.collectWeapon(gameMap[indexY][indexX]);
			}else {
				player2.collectWeapon(gameMap[indexY][indexX]);
			}
		}

		//Check if the players are next to one another
        if (isPlayer1Turn) {
    	    if( Math.abs(player1.X - player2.X) <= 1 && player1.Y == player2.Y
			   || Math.abs(player1.Y - player2.Y) <= 1 && player1.X == player2.X
			){
				movePermission=[];
				gameMode = 'fight';
				$("body").removeClass("move-mode");
			}else{
    	    	highlightAllCells(player2, player1);
    	    }

			setPlayerTurn();
        } else{
			if( Math.abs(player1.X - player2.X) <= 1 && player1.Y == player2.Y
				|| Math.abs(player1.Y - player2.Y) <= 1 && player1.X == player2.X
			){
				movePermission=[];
				gameMode = 'fight';
				$("body").removeClass("move-mode");
			}else{
				highlightAllCells(player1, player2);
			}

			setPlayerTurn();
		}


        player1.drawImg();
        player2.drawImg();

    }
});
     // Function that resets the game, is part of the startGame function
function resetGame() {
	$('#player1 .win-game').css('display', 'none');
	$('#player2 .win-game').css('display', 'none');
	$('#player1').removeClass('player-turn');
	$('#player2').removeClass('player-turn');
	gameMode = 'move';
	isPlayer1Turn = true;
		//Remove everything from field
	for (let i = 0; i < gameMap.length; i++) {
		for (let j = 0; j < gameMap[i].length; j++){
			gameMap[i][j]=0;
		}
	}

	player1.reset();
	player2.reset();
	draw();
}
   // Function that starts the game
function startGame(){
	resetGame();
	$('body').removeClass('initial-mode');
    $('body').addClass('move-mode');
    $("#player"+player1.id).addClass("player-turn");
	$("#player"+player2.id).removeClass("player-turn");
	countObst = 0;
		while(countObst < 17){
			let randomX = generateRandomPosition();
			let randomY = generateRandomPosition();
			if(gameMap[randomX][randomY]!=1){
				gameMap[randomX][randomY]=1;
				countObst++;
			}
		}

		let weaponCollection = [{type:'bomb', power: 30},{type:'ax', power: 15}, {type:'knife', power: 10}, {type:'spear', power: 25}, {type:'shield', power: 20} ];
		let maxCountOfWeapons = 8;
		let countOfWeapons = 0;
		while(countOfWeapons < maxCountOfWeapons){
			let randomX = generateRandomPosition();
			let randomY = generateRandomPosition();

			if(countOfWeapons > weaponCollection.length-1) {
				weapon = weaponCollection[generateRandomNumber(0, weaponCollection.length-1)];
			}else {
				weapon = weaponCollection[countOfWeapons];
			}

			if(gameMap[randomX][randomY] == 0){
				gameMap[randomX][randomY] = new Weapon(weapon.type, weapon.power);
				countOfWeapons++;
			}
		}


		do {
			player1.X = generateRandomPosition();
			player1.Y = generateRandomPosition();

		}while (gameMap[player1.Y][player1.X]);

		do {
			player2.X=generateRandomPosition();
			player2.Y=generateRandomPosition();
		}while(gameMap[player2.Y][player2.X] || Math.abs(player1.X-player2.X) <= 3 )


		draw();

		highlightAllCells(player1, player2);

		player1.drawImg();
		player2.drawImg();
		console.log('The button is working');
}

startGameButton.addEventListener('click', (event) => {
	startGame();

});



$(".attack").on("click", function() {
	if (gameMode == 'fight') {
		let whoClicked = $(this).parents(".player").attr("id");
		if (whoClicked == 'player1' && isPlayer1Turn) {
			player1.attack(player2);
			if (player2.health <= 0) {
				$('#player1 .win-game').css('display', 'inline');
				$("body").addClass("initial-mode");
				gameMode = false;
				setTimeout(function () {
					if (confirm('Player 1 won the battle. Do you wish to play again?')) {
						startGame();
					}else{
						resetGame();
					}

				}, 500);

			}else {
				setPlayerTurn();
			}
		} else if (whoClicked == 'player2' && !isPlayer1Turn) {
			player2.attack(player1);
			if (player1.health <= 0) {
				$('#player2 .win-game').css('display', 'inline');

				$("body").addClass("initial-mode");
				setTimeout(function () {
					if (confirm('Player 2 won the battle. Do you wish to play again?')) {
						startGame();
					}else{
						resetGame();
					}
				}, 500);
				gameMode = false;
			}else {
				setPlayerTurn();
			}
		}
	}

});


$(".defend").on("click", function () {
	if(gameMode == 'fight'){
		let whoClicked = $(this).parents(".player").attr("id");
		if(whoClicked == 'player1' && isPlayer1Turn){
			player1.applyShield();
			setPlayerTurn();
		}else if(whoClicked == 'player2' && !isPlayer1Turn){
			player2.applyShield();
			setPlayerTurn();
		}
	}
});
     // Showing the players' turns in the UI
function setPlayerTurn() {
	let $player1 = $("#player"+player1.id);
	let $player2 = $("#player"+player2.id);
	if(isPlayer1Turn){
		$player2.addClass("player-turn");
		$player1.removeClass("player-turn");


	}else {
		$player1.addClass("player-turn");
		$player2.removeClass("player-turn");

	}

	isPlayer1Turn = !isPlayer1Turn;
}

draw();

