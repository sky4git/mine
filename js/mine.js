/*
 ################          MineSweeper Game        ###################
 Author: Aakash Dodiya
 Date: 8 August 2012
 Description: Minesweeper is a grid of tiles, each of which may or may not cover hidden mines.
 The goal is to click on every tile except those that have mines. When a user clicks a tile, one of two things happens.
 If the tile was covering a mine, the mine is revealed and the game ends in failure. 
 If the tile was not covering a mine, it instead reveals the number of adjacent (including diagonals) tiles that are covering mines – and,
 if that number was 0, behaves as if the user has clicked on every cell around it. When the user is 
 confident that all tiles not containing mines have been clicked, the user presses a 
 Validate button (often portrayed as a smiley-face icon) that checks the clicked tiles: 
 if the user is correct, the game ends in victory, if not, the game ends in failure.
 
 Bonus Features :
 1: Support flagging on tiles to allow the user to leave notes on tiles he or she thinks might contain mines. ALT + Click
 2: Ability to resize the board (to 16x16 or 32x32) and change the difficulty by increasing the number of mines.
 */
//initlization of application
var areaType=""; // area type
var  rowdevider=1; // devider depend on area type for small(8), medium(16) and Large(32)
 
/*  Description : This function will start new game if user changes the area size by external size buttons
	Argument: size of an area, passed by onclick event of button
 */
function areaSize(area){
	$('#buttonWrapper').html('');
	switch(area){
		case 'small': 
			drawSmall(); break;	
		case 'medium':
			drawMedium(); break;
		case  'large':
			drawLarge(); break;
		default:
			drawLarge(); break;
		}
} 
 
 /*  Description : This function will start new game, it will check whether area size is been selected, if not 
 then default wil be Medium size playing field
 */
function newGame(){
		// clearing the old table and generate new
		$('#buttonWrapper').html('');
		switch(areaType){
		case 'small': 
			drawSmall(); break;	
		case 'medium':
			drawMedium(); break;
		case  'large':
			drawLarge(); break;
		default:
			drawLarge(); break;
		}
		
}

/* Description: This function will validate game for user, if user want to check game whether he won the game or not
*/
function validate(){
	var flag = true; // setting the flag
	for(var i=1;i<=(rowdevider*rowdevider); i++){
		var button = document.getElementById(i);
		if(button.className != "clicked" && button.className != "bomb"){
			flag = false; break; // if Any cell is left to reveal by user then flag is false and it means game is yet to win
		}
	}
	
	if(flag == true){
		alert("You won! Great Victory :)");
	}else{
		alert("You Didnt win yet! Sorry :(");
	}
}

/*	Description: This function will reveal all the cells without ending the game, it will be called from CHEAT button from page
*/
function cheat(){
	for(var i=1;i<=(rowdevider*rowdevider); i++){
		var button = document.getElementById(i);
		if(button.className == 'bomb'){
			button.innerHTML = button.value;
		}
	}
}


/* Description: This function will end game, it will called when user click the bomb
*/
function endGame(id, oEvent){
	var element = document.getElementById(id);
	if (oEvent.altKey) {
		element.innerHTML = "?";  element.setAttribute('class', 'flag'); //Setting up a flag 
	}else{
		//Game over 
		// Lets reaveal all cells for user
		revealAll();
		
		// Asking for confirmation for new game
		if(confirm("Game over dear, Do you want to start new Game?")){
			newGame();
		}
	}
}

/* Description: This function will plant bombs randomly in the field depending the size of the field
   Argument:  number of bombs to plant
*/
function plantBombs(randCount){ 
	//Generating Random number to attach the 'bomb' to random buttons 
	var bombArray = new Array();
	for(var i=0; i<randCount; i++){

		var randomNumber = Math.floor(Math.random()*(rowdevider * rowdevider));
		var buttonNumber = document.getElementById(randomNumber);
		buttonNumber.setAttribute("class", 'bomb'); //For Most Browsers
		
		buttonNumber.setAttribute('onclick', 'endGame('+randomNumber+',event)');  //If user click bomb - Gameover
		buttonNumber.value = '&#164;';
		// While assigning a bomb we also aaaign the nearest values to other buttons for that we need an array of bombs
		bombArray.push(randomNumber);

	}
	assignNearValues(bombArray); // To assign near values for cells near bomb - we are passing bombcell id array
}

/* Description: This function draw small area of game, it means it wil lbe 8 x 8 area to play
*/
function drawSmall(){
	areaType="small"; rowdevider = 8;
	$('#buttonWrapper').html(drawArea(8,8));
	// Passing random number to plant bombs // Maximum 5 bombs but could be less  for small area
	plantBombs(10);
}

/* Description: This function draw Medium area of game, it means it wil lbe 16 x 16 area to play
*/
function drawMedium(){
	areaType="medium"; rowdevider = 16;
	$('#buttonWrapper').html(drawArea(16,16));
	plantBombs(80);
}

/* Description: This function draw Large area of game, it means it wil lbe 32 x 32 area to play
*/
function drawLarge(){
	areaType="large"; rowdevider = 32;
	$('#buttonWrapper').html(drawArea(32,32));
	plantBombs(200);
}

/* Description : Drawing area of Game
	Creating a table with buttons
*/
function drawArea(x, y){
	var str = ""; var k=1;
	str = "<table border='0' class='mine-sweeper'>";
	for(var i=0; i<x; i++){ 
		str += "<tr id='tr"+(i+1)+"'>";
		for(var j=1; j<=y; j++){
			str += "<td><button id='"+k+"' onclick='reveal("+k+", event)'>&nbsp;</button></td>"; k++;
		}
		str += "</tr>"; 
	}
	str += "</table>";
	return str;
}

/* Description: Assign neeat values to button near to bombs
	Arguments : Array of Bomb cell Ids
*/
function assignNearValues(bombArray){ 
	// Now we have to get X,Y for bom cell  X=row and Y=col
	for(var i=0;i<bombArray.length; i++){
		var rowOfBomb = Math.ceil(bombArray[i] / rowdevider);    // Getting rownumber of bomb
		var colOfBomb = bombArray[i] - (rowdevider * (Math.floor(bombArray[i] / rowdevider)));   // Getting column number of Bomb
		colOfBomb = (( colOfBomb > 0) ? colOfBomb : rowdevider);  // For the column 8 or 16 or 32 it returns 0 as per above logic so making it 8 or 16 or 32
		
		// Now we have to replace values of button surroundng of Bomb
		/* Arguments (bombnumber, rownumber, colnumber) */
		replaceSurroundCellsValues(bombArray[i], rowOfBomb, colOfBomb, rowdevider);
	}
}

/* Description: This function will replace values of cell which is near to bombs in row above and bottom
   Arguments : id of bomb, row of bomb, column of bomb, devider which is size of table small(8), medium(16) or large(32)
*/
function replaceSurroundCellsValues(bomb, row, col, devider){
	
	if(col == 1)  // If column is 1 then there will be no near cell on left side
	{	
		var cell = document.getElementById((bomb + 1));
		if(cell.className != 'bomb' ){
			cell.setAttribute('class', 'near'); 	cell.value = ((cell.value ==  '1' )  ? '2' :  '1');
		}
	}else if(col == devider){  // if column is 8 or 16 or 32 then there will be no near cell on right side
		var cell = document.getElementById((bomb  - 1));
		if(cell.className != 'bomb' ){
			cell.setAttribute('class', 'near'); 	cell.value = ((cell.value ==  '1' )  ?  '2' :  '1');
		}
	}else{ // for all other column there will be left and right cells
		var rowcell1 = document.getElementById((bomb  + 1));
		var rowcell2 = document.getElementById((bomb  - 1));
		if(rowcell1.className != 'bomb'){
			rowcell1.setAttribute('class', 'near');  rowcell1.value =  ((rowcell1.value ==  '1' )  ? '2'  : '1');  // Assigning value to right cell
		}
		if(rowcell2.className != 'bomb'){
			rowcell2.setAttribute('class', 'near');  rowcell2.value = ((rowcell2.value ==  '1' )  ? '2'  : '1'); //Assigning value to left cell
		}
	}
	
	if(row == 1) { // If row is 1 then there will be no top cell
		var cell = document.getElementById((bomb + devider));
		if(cell.className != 'bomb'){
			cell.setAttribute('class', 'near');		cell.value =  ((cell.value ==  '1' )  ? '2' :  '1');
		}
	}else if(row == devider){ // if row is 8 or 16 or 32 then there will be no bottom cell
		var cell = document.getElementById((bomb - devider));
		if(cell.className != 'bomb'){
			cell.setAttribute('class', 'near'); 		cell.value =  ((cell.value ==  '1' )  ? '2' :  '1');
		}
	}else{ // for all others there will be top and bottom cells
		var colcell1 = document.getElementById((bomb  + devider));
		var colcell2 = document.getElementById((bomb  - devider));
		if(colcell1.className != 'bomb'){
			colcell1.setAttribute('class', 'near');  colcell1.value = ((colcell1.value ==  '1' )  ? '2'  :  '1');
		}
		if(colcell2.className != 'bomb'){
			colcell2.setAttribute('class', 'near');  colcell2.value = ((colcell2.value ==  '1' )  ? '2' :  '1');
		}
	}
}

/*  Description: This function reveal the cell if not bomb, it will also go in loop to randomaly reveal cells which is near by to clicked cells and not near to bombs
	Argument: id of clicked cell
*/
function reveal(id, oEvent){
	var element = document.getElementById(id);
	if (oEvent.altKey) {
		element.innerHTML = "?";  element.setAttribute('class', 'flag'); //Setting up a flag 
	}else{
		element.setAttribute('class', 'clicked');   // Changing css class name so that we know this cell has been clicked
		if(element.value == 1 || element.value == 2){
			element.innerHTML = element.value; // if value is 1 or 2 = near to bomb
		}else{
			element.innerHTML = "&nbsp;";
			var adjCells = revealAdjucents(id);  // in case of cell is not near to bomb we reveal all adjucent for user (I am not sure its necessary to do - but doing it for making game intersting)
			var i;
			for(i in adjCells){  // for loop of nearby empty cells
				var adjTempArray = revealAdjucents(adjCells[i]); //reacalling the function to reveal others
				adjCells.push(adjTempArray); 
			}
		}
	}
	
}

/* Description: This function will reveal cells of the row above and bottom also right and left of clicked cell
   Argument: id of adjucent cell
*/
function revealAdjucents(id){
	
	var rowOfBomb = Math.ceil(id / rowdevider);    // Getting rownumber of bomb
	var colOfBomb = id - (rowdevider * (Math.floor(id / rowdevider)));   // Getting column number of Bomb
	colOfBomb = (( colOfBomb > 0) ? colOfBomb : rowdevider);  // For the column 8 or 16 or 32 it returns 0 as per above logic so making it 8 or 16 or 32
	var  adjArray = new Array();  // defining array to collect all near by cell data to return
	if(colOfBomb == 1)  // If column is 1 then there will be no near cell on left side
	{	
		var cell = document.getElementById((id + 1));
		if(cell.className != 'bomb'  && cell.className != 'near' && cell.className != 'clicked'){
			cell.innerHTML = "&nbsp;";  cell.setAttribute('class', 'clicked'); adjArray.push(id + 1);
		}
	}else if(colOfBomb == rowdevider){  // if column is 8 or 16 or 32 then there will be no near cell on right side
		var cell = document.getElementById((id  - 1));
		if(cell.className != 'bomb'  && cell.className != 'near' && cell.className != 'clicked'){
			cell.innerHTML = "&nbsp;";  cell.setAttribute('class', 'clicked');  adjArray.push(id - 1);
		}
	}else{ // for all other column there will be left and right cells
		var rowcell1 = document.getElementById((id  + 1));
		var rowcell2 = document.getElementById((id  - 1));
		if(rowcell1.className != 'bomb'  && rowcell1.className != 'near' && rowcell1.className != 'clicked'){
			rowcell1.innerHTML = "&nbsp;";  rowcell1.setAttribute('class', 'clicked');  adjArray.push(id + 1);
		}
		if(rowcell2.className != 'bomb'  && rowcell2.className != 'near' && rowcell2.className != 'clicked'){
			rowcell2.innerHTML = "&nbsp;";  rowcell2.setAttribute('class', 'clicked');   adjArray.push(id - 1);
		}
	}
	
	if(rowOfBomb == 1) { // If row is 1 then there will be no top cell
		var cell = document.getElementById((id + rowdevider));
		if(cell.className != 'bomb'  && cell.className != 'near' && cell.className != 'clicked'){
			cell.innerHTML = "&nbsp;"; cell.setAttribute('class', 'clicked');   adjArray.push(id + rowdevider);
		}
	}else if(rowOfBomb== rowdevider){ // if row is 8 or 16 or 32 then there will be no bottom cell
		var cell = document.getElementById((id - rowdevider));
		if(cell.className != 'bomb'  && cell.className != 'near' && cell.className != 'clicked'){
			cell.innerHTML = "&nbsp;";  cell.setAttribute('class', 'clicked');   adjArray.push(id - rowdevider);
		}
	}else{ // for all others there will be top and bottom cells
		var colcell1 = document.getElementById((id  + rowdevider));
		var colcell2 = document.getElementById((id  - rowdevider));
		if(colcell1.className != 'bomb' && colcell1.className != 'near' && colcell1.className != 'clicked'){
			colcell1.innerHTML = "&nbsp;";  colcell1.setAttribute('class', 'clicked');   adjArray.push(id + rowdevider);
		}
		if(colcell2.className != 'bomb' && colcell2.className != 'near'  && colcell2.className != 'clicked'){
			colcell2.innerHTML = "&nbsp;";  colcell2.setAttribute('class', 'clicked');   adjArray.push(id - rowdevider);
		}
	}
	return adjArray;
}

/* Description: This function will reveal all the cells as it will be called in the end of the game or when the bomb is clicked
*/
function revealAll(){
	for(var i=1;i<=(rowdevider*rowdevider); i++){
		var button = document.getElementById(i);
		button.innerHTML = button.value;
	}
}

