//OBJECT MODEL

let model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],
	
	fire: function(guess) {
		for (let i = 0; i < this.numShips; i++) { // check all ships
			let ship = this.ships[i];
			let index = ship.locations.indexOf(guess); //check there is the received index in the array of coordinates of the ship (output: index or -1)
			if (index !== -1) {
				ship.hits[index] = "hit"; //if find a match mark cell as "hit"
				view.displayHit(guess);
				view.displayMessage("Ура! Попадание!");
				 if (this.isSunk(ship)) {
					 view.displayMessage("Браво, капитан! Вы потопили целый корабль!");
					 this.shipsSunk++;
				 }
				return true;
			}
			
		}
		view.displayMiss(guess); //mark cell as "miss"
		view.displayMessage("Увы, мимо...");
		return false; //if sorted through all ships and didn't find a match
	},
	
	isSunk: function(ship) {
		for (let i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},
	
	generateShipLocations: function() {
		let locations;
		for (let i = 0; i < this.numShips; i++) { //for each ship generate a position
			do {
				locations = this.generateShip();
			} while (this.collision(locations)); //check collision
			this.ships[i].locations = locations; //save position without collision
		}
	},
	
	generateShip: function() {
		let direction = Math.floor(Math.random() * 2);
		let row;
		let col;
		
		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}
		
		let newShipLocations = [];
		for (let i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
	
	collision: function(locations) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			for (let j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};


// OBJECT RESPONSIBLE FOR DISPLAYING MESSAGES AND UPDATING IMAGES

let view = {
	
	displayMessage: function(msg) {
		let messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	
	displayHit: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	
	displayMiss: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};


//OBJECT CONTROLLER

let controller = {
	guesses: 0,

	processGuess: function(guess) { //receive user's coordinates
	  let location = guess;
	  console.log(location);
	  if (location) {
		  this.guesses++;
		  let hit = model.fire(location);
		  if (hit && model.shipsSunk === model.numShips) {
			  view.displayMessage("Капитан, вы потопили все вражеские корабли!" + "Попыток: " + this.guesses);
			  let tdItems = document.getElementsByTagName("td");
			   	for (let i = 0; i < tdItems.length; i++) {
					tdItems[i].onclick = view.displayMessage("Капитан, вы потопили все вражеские корабли! Попыток: " + this.guesses); //block new clicks after win
				}
		  }
	  }
	}
}


window.onload = init;

//GET DATE FROM USER

function init() {
	let tdItems = document.getElementsByTagName("td");
	for (let i = 0; i < tdItems.length; i++) {
        tdItems[i].onclick = showAnswer;
	}
 
	function showAnswer(eventObj) {
		let tdItem = eventObj.target;
		let guess = tdItem.id;
		controller.processGuess(guess);
	}

	// place the ships on the game board
	model.generateShipLocations();
}
