const splash = document.getElementById("splash");
const boom = document.getElementById("boom");
const sink = document.getElementById("sink");
const mainEl = document.getElementById('main-section')
let shotsLeft;
let infoPanelEl;
let gameboardEl;
let shipPanelEl;
let gridObject;
let orient;
let sunkShipsCount;
let ships = [];
let usedSquares = []
let emptyCount;

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
    shotsLeft = 38;
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
    const startOverButton = document.createElement('button');
    startOverButton.innerText = 'Start Over';
    startOverButton.onclick = initialize;
    infoPanelEl.appendChild(startOverButton);
}


function fillGameGridAndObjects() {
    //fill the ships array by hand
    ships = [
    {name: 'Aircraft Carrier', size: 5, image: 'assets/aircraft-carrier.png', damage: 0, tag: 'aircraft-carrier'},
    {name: 'Battleship', size: 4, image: 'assets/battleship.png', damage: 0, tag: 'battleship'},
    {name: 'Submarine', size: 3, image: 'assets/submarine.png', damage: 0, tag: 'submarine'},
    {name: 'Cruiser', size: 3, image: 'assets/cruiser.png', damage: 0, tag: 'cruiser'},
    {name: 'Destroyer', size: 2, image: 'assets/destroyer.png', damage: 0, tag: 'destroyer'},
    ];
    //reset the grid object and some variables
    usedSquares = [];
    sunkShipsCount = 0;
    gridObject = {};
    let squareTag = 0
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
            //for each row add a square 10 times
            rowEl.appendChild(squareEl);
            //In the grid Object add an object for each square by its row and column
            gridObject[rowNum][colNum] = {};
            //give the square's entry in the grid object an id and mark it empty
            gridObject[rowNum][colNum].tag = squareTag;
            gridObject[rowNum][colNum].content = 'empty';
            //give the actual square the same id
            squareEl.id = squareTag;
            squareTag++;
            //give each square a click event that sends its row and column number
            squareEl.addEventListener('click', (event) => {
            gameboardClick(rowNum, colNum);
            });
        };
    };
};

//For each ship we look for an open spot
//If the spot is not open we don't rerun placeShips, we don't try again for all the ships
//Instead if the spot is not open we rerun findOpenSpot, we try again for that one ship
function placeShips() {
    for (const ship of ships) {
        findOpenSpot(ship);
    };
};

// This is used in the find open spot function
// Randomly get vertical or horizontal orientation
function setOrient() {
    const random0to1 = Math.floor(Math.random() * 2);
    if (random0to1 == 0) { 
        orient = "vertical";
    } else if (random0to1 == 1) { 
        orient = "horizontal";
    };
}

// This is also used in the find open spot function
// We get a random row and column out of 10 as a spot to try to place a ship
// Depending on whether orientation is vertical or horizontal we check addition squares downward or to the right to fit the entire ship
// If the spot is too near the edge of the board we  will look for a an 11th spot in the row or column
// Because there is no 11th spot this would throw an error
// To avoid the error we subtract the ship size from the random number so that the first spot analyzed can never be too close to the edge 
function getRandoms(ship) {
    if (orient == 'vertical') {
        randRow = Math.floor(Math.random() * (10 - ship.size) + 1);
        randCol = Math.floor(Math.random() * 10 + 1);
    } else if (orient == 'horizontal') {
        randCol = Math.floor(Math.random() * (10 - ship.size) + 1);
        randRow = Math.floor(Math.random() * 10 + 1);
    };
}

// Verify there is enough room for the ship based on the intial spot chosen before writing the ship into the grid object squares.
function findOpenSpot(ship) {
    setOrient();
    getRandoms(ship);
    emptyCount = 0;
    if (orient == 'vertical') {
        for (let k = 0; k < ship.size; k++) {
            if (gridObject[randRow + k][randCol].content == 'empty') {
            emptyCount++
            };
        };
        //if the size of the ship is equal to the empty squares, write it into all of them.
        if (ship.size == emptyCount) {
            for (let m = 0; m < ship.size; m++) {
                gridObject[randRow + m][randCol].content = ship.tag;
                usedSquares.push(gridObject[randRow + m][randCol].tag)
            };
        } else {
            findOpenSpot(ship);
        };
    } else if (orient == 'horizontal') {
        for (let w = 0; w < ship.size; w++) {
            if (gridObject[randRow][randCol + w].content == 'empty') {
            emptyCount++
            };
        };

        if (ship.size == emptyCount) {
            for (let b = 0; b < ship.size; b++) {
                gridObject[randRow][randCol + b].content = ship.tag;
                usedSquares.push(gridObject[randRow][randCol + b].tag)
            };
        } else {
            findOpenSpot(ship);
        };   
    };
};

// Fill the ship panel
// Include empty divs over the ships to be filled with transparent red overlay when the ship is sunk
function fillShipPanel() {
    for (const ship of ships) {
        const shipImageDiv = document.createElement('div');
        shipImageDiv.className = 'ship-image-div';
        const shipImage = document.createElement('img');
        shipImage.src = ship.image;
        shipImage.className = 'ship-image';
        const shipNameP = document.createElement('p');
        shipNameP.innerText = ship.name;
        shipNameP.className = 'ship-name-p';
        const shipSizeP = document.createElement('p');
        shipSizeP.innerText = 'Size: ' + ship.size;
        shipSizeP.classList = 'ship-size-p';
        const shipImageDivOverlay = document.createElement('div');
        shipImageDivOverlay.className = "ship-image-div-overlay";
        shipImageDivOverlay.id = ship.tag;
        shipPanelEl.appendChild(shipImageDiv);
        shipImageDiv.appendChild(shipNameP);
        shipImageDiv.appendChild(shipSizeP);
        shipImageDiv.appendChild(shipImage);
        shipImageDiv.appendChild(shipImageDivOverlay);
    };

};

function gameboardClick(rowNum, colNum) {
    const clickedSquare = event.target
    if (gridObject[rowNum][colNum].content == 'empty') {
        miss(rowNum, colNum, clickedSquare);
    } else if (gridObject[rowNum][colNum].content != 'empty' && (gridObject[rowNum][colNum].content != 'closed')) {
        hit(rowNum, colNum, clickedSquare);
    }
    const shotsLeftP = document.getElementById('shots-left'); 
    shotsLeftP.innerText = shotsLeft;
};

function miss(rowNum, colNum, clickedSquare) {
    //close the clicked square
    gridObject[rowNum][colNum].content = 'closed';
    clickedSquare.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    //reduce the number of shots available
    shotsLeft--;
    splash.play();
    //check for a loss
    checkGameStatus();
};

function hit(rowNum, colNum, clickedSquare) {
    hitShip = gridObject[rowNum][colNum].content;
    // reduce the number of shots available
    shotsLeft--;
    //if there a hit, check if any ships have been sunk
    for (const ship of ships) {
        if (hitShip == ship.tag) {
            ship.damage++
            sinkCheck(ship);
        }
    };
    // Check for a loss or win
    checkGameStatus();
    boom.play();
    gridObject[rowNum][colNum].content = 'closed';
    clickedSquare.classList.add('explosion');
}

function sinkCheck(ship) {
    if (ship.size == ship.damage) {
        shipSink(ship);
    };
}

function shipSink(ship) {
    sink.play();
    const sunkShip = document.getElementById(ship.tag);
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
    let toBecomeRed;
    let squareOverlay;
    const youLose = document.createElement('p');
    youLose.innerText = 'YOU LOSE!'
    youLose.className = 'lose';
    gameboardEl.appendChild(youLose);
    for (let usedSquare of usedSquares) {
        toBecomeRed = document.getElementById(usedSquare);
        squareOverlay = document.createElement('div')
        squareOverlay.className = 'square-overlay'
        toBecomeRed.appendChild(squareOverlay);
    };
};

function win() {
    closeGameboard();
    const youWin = document.createElement('p');
    youWin.innerText = 'YOU WIN!'
    youWin.className = 'win';
    gameboardEl.appendChild(youWin);
};

function closeGameboard() {
    for (let rowNum = 1; rowNum <= 10; rowNum++) {
        for (let colNum = 1; colNum <= 10; colNum++) {
            gridObject[rowNum][colNum].content = 'closed';
        };
    };
};

initialize();
