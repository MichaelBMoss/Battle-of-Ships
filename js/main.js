const splash = document.getElementById("splash");
const boom = document.getElementById("boom");
const sink = document.getElementById("sink");
const mainEl = document.getElementById('main-section')
let shotsLeft;
let infoPanelEl;
let gameboardEl;
let shipPanelEl;
let gridObject;
let orientation;
let sunkShipsCount;
let ships = [];

function initialize() {
    createMainSectionStructure();
    fillInfoPanel();
    fillGameGridAndObjects();
    placeShips();
    fillShipPanel();
};

//the intialize function is meant to double as a rest function so it clears things before building them
function clearMainSectionEl() {
    const mainContents = mainEl.querySelectorAll('*');
    mainContents.forEach(element => element.remove());
}

//the main section has 3 panels
//from left to right those are the info panle, the gameboars, the ship panel
function createMainSectionStructure() {
    shotsLeft = 36;
    clearMainSectionEl();
    infoPanelEl = document.createElement('div');
    infoPanelEl.id = "info-panel";
    mainEl.appendChild(infoPanelEl);
    gameboardEl = document.createElement('div');
    gameboardEl.id = "gameboard";
    mainEl.appendChild(gameboardEl);
    shipPanelEl = document.createElement('div')
    shipPanelEl.id = "ship-panel";
    mainEl.appendChild(shipPanelEl);
};

function fillInfoPanel() {
    const instructionsP = document.createElement('p');
    instructionsP.innerText = 'Find And Destroy The Enemy Fleet';
    infoPanelEl.appendChild(instructionsP);
    const shotsMessage = document.createElement('p');
    shotsMessage.innerText = "Shots Remaining:";
    infoPanelEl.appendChild(shotsMessage);
    const shotsLeftP = document.createElement('p');
    shotsLeftP.id = 'shots-left';
    shotsLeftP.innerText = shotsLeft;
    infoPanelEl.appendChild(shotsLeftP);

}


function fillGameGridAndObjects() {
    //fill the ship object by hand
    ships = [
    {name: 'Aircraft Carrier', size: 5, image: 'assets/aircraft-carrier.png', damage: 0, id: 'aircraft-carrier'},
    {name: 'Battleship', size: 4, image: 'assets/battleship.png', damage: 0, id: 'battleship'},
    {name: 'Submarine', size: 3, image: 'assets/submarine.png', damage: 0, id: 'submarine'},
    {name: 'Cruiser', size: 3, image: 'assets/cruiser.png', damage: 0, id: 'cruiser'},
    {name: 'Destroyer', size: 2, image: 'assets/destroyer.png', damage: 0, id: 'destroyer'},
    ];
    //reset the grid object and some variables
    sunkShipsCount = 0;
    gridObject = {};
    //iterate the creation of 10 rows
    for (let rowNum = 1; rowNum <= 10; rowNum++) {
        const rowEl = document.createElement('div');
        rowEl.className = "row";
        gameboardEl.appendChild(rowEl);
        //give each row an entry in the grid object
        gridObject[rowNum] = {};
        //for each row iterate through the creation of 10 divs to create 100 board squares
        for (let colNum = 1; colNum <= 10; colNum++) {
            const squareEl = document.createElement('div');
            squareEl.className = "square";
            rowEl.appendChild(squareEl);
            //give each entry row in the grid object an entry for each of its squares
            //set each square to none. some will be filled with ships later.
            gridObject[rowNum][colNum] = 'none';
            //give each square a click event that sends its row and column number
            squareEl.addEventListener('click', (event) => {
            gameboardClick(rowNum, colNum);
            });
        };
    };
};

//for each ship I wanted to be able to look for an open spot and then then look again, if I don't find one.
function placeShips() {
    for (const ship of ships) {
        findOpenSpot(ship);
    };
};

// this is used in the find open spot function
// randomly get vertical or horizontal orientation
function setOrientation() {
    const random0to1 = Math.floor(Math.random() * 2);
    if (random0to1 == 0) { 
        orientation = "vertical";
    } else if (random0to1 == 1) { 
        orientation = "horizontal";
    };
}

// this is also used in the find open spot function
// we will choose a spot randomly and then see if there are enough spots for the entire ship by looking either down or to the right
// but if our spot is too near the edge of the board we will look for a spot that doesn't exist.
// to avoid an error I subtract the ship size from the random number so the spot can never be close enough to the edge for that to happen
function getRandoms(ship) {
    if (orientation == 'vertical') {
        randRow = Math.floor(Math.random() * (10 - ship.size) + 1);
        randCol = Math.floor(Math.random() * 10 + 1);
    } else if (orientation == 'horizontal') {
        randCol = Math.floor(Math.random() * (10 - ship.size) + 1);
        randRow = Math.floor(Math.random() * 10 + 1);
    };
}

// verify there is enough room for the ship based on the intial spot chosen before writing the ship into the grid object squares.
function findOpenSpot(ship) {
    setOrientation();
    getRandoms(ship);
    let noneCount = 0;
    if (orientation == 'vertical') {
        for (let k = 0; k < ship.size; k++) {
            if (gridObject[randRow + k][randCol] == 'none') {
            noneCount++
            };
        };
        //if the size of the ship is equal to the empty squares, write it into all of them.
        if (ship.size == noneCount) {
            for (let m = 0; m < ship.size; m++) {
                gridObject[randRow + m][randCol] = ship.id;
            }
        } else {
            findOpenSpot(ship);
        };
    };
    if (orientation == 'horizontal') {
        for (let w = 0; w < ship.size; w++) {
            if (gridObject[randRow][randCol + w] == 'none') {
            noneCount++
            };
        };
        if (ship.size == noneCount) {
            for (let b = 0; b < ship.size; b++) {
                gridObject[randRow][randCol + b] = ship.id;
            };
        } else {
            findOpenSpot(ship);
        };   
    };
};

// fill the ship panel
// include empty divs over the ships to be filled with transparent red overlay when they are sunk
function fillShipPanel() {
    for (const ship of ships) {
        const shipImage = document.createElement('img');
        shipImage.src = ship.image;
        shipImage.className = 'ship-image';
        const shipImageDiv = document.createElement('div');
        shipImageDiv.className = 'ship-image-div';
        shipImageDiv.id = ship.id;
        const shipDescriptionDiv = document.createElement('div');
        shipDescriptionDiv.className = 'ship-description-div';
        const shipNameP = document.createElement('p');
        shipNameP.innerText = ship.name;
        const shipSizeP = document.createElement('p');
        shipSizeP.innerText = 'Size: ' + ship.size;
        const redOverlayDiv = document.createElement('div');
        redOverlayDiv.className = "red-overlay-div";
        shipPanelEl.appendChild(shipDescriptionDiv);
        shipPanelEl.appendChild(shipImageDiv);
        shipDescriptionDiv.appendChild(shipNameP);
        shipDescriptionDiv.appendChild(shipSizeP);
        shipImageDiv.appendChild(shipImage);
        shipImageDiv.appendChild(redOverlayDiv);
    };

};

function gameboardClick(rowNum, colNum) {
    const clickedSquare = event.target
    if (gridObject[rowNum][colNum] == 'none') {
        miss(rowNum, colNum, clickedSquare);
    } else if (gridObject[rowNum][colNum] != 'none' && (gridObject[rowNum][colNum] != 'closed')) {
        hit(rowNum, colNum, clickedSquare);
    }
    const shotsLeftP = document.getElementById('shots-left'); 
    shotsLeftP.innerText = shotsLeft;
};

function miss(rowNum, colNum, clickedSquare) {
    //close the clicked square
    gridObject[rowNum][colNum] = 'closed';
    clickedSquare.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    //reduce the number of shots available
    shotsLeft--;
    splash.play();
    //check for a loss
    checkGameStatus();
};

function hit(rowNum, colNum, clickedSquare) {
    hitShip = gridObject[rowNum][colNum];
    // reduce the number of shots available
    shotsLeft--;
    //if there a hit, check if any ships have been sunk
    for (const ship of ships) {
        if (hitShip == ship.id) {
            ship.damage++
            sinkCheck(ship);
        }
    };
    // check for a loss or win
    checkGameStatus();
    boom.play();
    gridObject[rowNum][colNum] = 'closed';
    clickedSquare.classList.add('explosion');
}

function sinkCheck(ship) {
    if (ship.size == ship.damage) {
        shipSink(ship);
    };
}

function shipSink(ship) {
    sink.play();
    const sunkShip = document.getElementById(ship.id);
    // add the red overlay
    sunkShip.classList.add('red');
    sunkShipsCount++;
    checkGameStatus();
}

function checkGameStatus() {
    if (sunkShipsCount >= 5) {
        win();
    } else if (shotsLeft <= 0) {
        lose();
    };
};

function lose() {
    closeGameboard();
    const youLose = document.createElement('p');
    youLose.innerText = 'YOU LOSE!'
    youLose.className = 'win-lose';
    mainEl.appendChild(youLose);   
};

function win() {
    closeGameboard();
    const youWin = document.createElement('p');
    youWin.innerText = 'YOU WIN!'
    youWin.className = 'win-lose';
    mainEl.appendChild(youWin);
};

function closeGameboard() {
    for (let rowNum = 1; rowNum <= 10; rowNum++) {
        for (let colNum = 1; colNum <= 10; colNum++) {
            gridObject[rowNum][colNum] = 'closed';
        };
    };
};

initialize();