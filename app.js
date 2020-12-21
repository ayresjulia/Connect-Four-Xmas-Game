//Xmas edition animation
// function randomRGB() {
// 	const r = 0;
// 	const g = Math.floor(Math.random() * 256); //random from 0 to 255;
// 	const b = 0;
// 	return `rgb(${r}, ${g}, ${b})`;
// }

// const letters = document.querySelectorAll('.xmas');

// const intervalId = setInterval(function () {
// 	for (let letter of letters) {
// 		letter.style.color = randomRGB();
// 	}
// }, 1000);

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	// set "board" to empty HEIGHT x WIDTH
	for (let y = 0; y < HEIGHT; y++) {
		//iterate through height
		board.push(Array.from({ length: WIDTH })); //pushing array of width
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// get "htmlBoard" variable from the item in HTML w/ID of "board"
	const board = document.querySelector('#board');
	// add comment for this code
	//create a top row
	const top = document.createElement('tr');
	//set id of top row as 'column-top'
	top.setAttribute('id', 'column-top');
	//when top row is clicked, do something
	top.addEventListener('click', handleClick);

	//iterate through width
	for (let x = 0; x < WIDTH; x++) {
		//create the table data element, call it headCell
		let headCell = document.createElement('td');
		//set id of headCell to x
		headCell.setAttribute('id', x);
		//make headCell a child of top line
		top.append(headCell);
	}
	//add top row to the html board
	board.append(top);

	// iterate through height
	for (let y = 0; y < HEIGHT; y++) {
		//create row element
		const row = document.createElement('tr');
		//iterate throught width to create cell element
		for (let x = 0; x < WIDTH; x++) {
			//create cell element
			const cell = document.createElement('td');
			//create cell id
			cell.setAttribute('id', `${y}-${x}`);
			//make cell a child of row
			row.append(cell);
		}
		//make a row a child of htmlBoard
		board.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	//write the real version of this, rather than always returning 0
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	//make a div and insert into correct table cell
	const piece = document.createElement('div');
	piece.classList.add('piece');
	piece.classList.add(`p${currPlayer}`);
	piece.classList.add('fall');
	// piece.style.top = -50 * (y + 2); //???
	const spot = document.getElementById(`${y}-${x}`);
	spot.append(piece);
}

/** endGame: announce game end */

function grinch() {
	//pop up image
	const grinch = document.createElement('img');
	grinch.classList.add = 'grinch'; //add a class to make animation after
	grinch.setAttribute(
		'src',
		'https://i.pinimg.com/originals/e6/a8/92/e6a892cbd3622eb7591cfde96a8bc23e.gif'
	);
	document.getElementById('popup').append(grinch);
	document.body.style.backgroundImage =
		"url('https://wallpaperaccess.com/full/809281.jpg')";
	document.body.style.backgroundSize = '120% 140%';
	document.getElementById('h1').textContent = 'GRINCH WON!';
	document.getElementById('h6').textContent =
		"It's because I'm green, isn't it?";
	document.getElementById('game').remove();
}

function santa() {
	//pop up image
	const santa = document.createElement('img');
	santa.classList.add = 'santa'; //add a class to make animation after
	santa.setAttribute(
		'src',
		'https://media.giphy.com/media/RfqkE7ej3vxhywNamE/giphy.gif'
	);
	document.getElementById('popup').append(santa);
	document.body.style.backgroundImage =
		"url('https://wallpaperaccess.com/full/809281.jpg')";
	document.body.style.backgroundSize = '120% 140%';
	document.getElementById('h1').textContent = 'SANTA WON!';
	document.getElementById('h6').textContent =
		'Aaand we’re going to have the hap-hap-happiest Christmas!';
	document.getElementById('game').remove();
}

function endGame(msg) {
	alert(msg);
}
/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell as non-zero positive number (+)
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	//add line to update in-memory board
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		if (currPlayer === 1) {
			return grinch();
		}
		return santa();
	}

	// check for tie
	//check if all cells in board are filled; if so call, call endGame
	if (board.every(row => row.every(cell => cell))) {
		return endGame('Tie!');
	}

	// switch players
	//switch currPlayer 1 <-> 2
	currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(
			([y, x]) =>
				y >= 0 &&
				y < HEIGHT &&
				x >= 0 &&
				x < WIDTH &&
				board[y][x] === currPlayer
		);
	}

	//read and understand this code. Add comments to help you.
	//iterate through each cell (y and x axis)
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			//horizontal win
			let horiz = [
				[y, x],
				[y, x + 1],
				[y, x + 2],
				[y, x + 3]
			];
			//vertical win
			let vert = [
				[y, x],
				[y + 1, x],
				[y + 2, x],
				[y + 3, x]
			];
			//diagonal right win
			let diagDR = [
				[y, x],
				[y + 1, x + 1],
				[y + 2, x + 2],
				[y + 3, x + 3]
			];
			//diagonal left win
			let diagDL = [
				[y, x],
				[y + 1, x - 1],
				[y + 2, x - 2],
				[y + 3, x - 3]
			];

			if (win(horiz) || win(vert) || win(diagDR) || win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
