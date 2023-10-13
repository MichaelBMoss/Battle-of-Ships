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
let randRow;
let randCol;
let noneCount;
let shipImageDiv;
let shipImage;
let shipDescriptionDiv;
let shipNameP;
let shipSizeP;
let redOverlayDiv;
let clickedSquareID;
let clickedSquare;
let sunkShipsCount;
let ships = [];

function initialize() {
    createMainSectionStructure();
    fillInfoPanel();
    fillGameGridAndObjects();
    placeShips();
    fillShipPanel();
};

function clearMainSectionEl() {
    const mainContents = mainEl.querySelectorAll('*');
    mainContents.forEach(element => element.remove());
}

function createMainSectionStructure() {
    shotsLeft = 34;
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
    let instructionsP = document.createElement('p');
    instructionsP.innerText = 'Find And Destroy The Enemy Fleet';
    infoPanelEl.appendChild(instructionsP);
    let shotsMessage = document.createElement('p');
    shotsMessage.innerText = "Shots Remaining:";
    infoPanelEl.appendChild(shotsMessage);
    let shotsLeftP = document.createElement('p');
    shotsLeftP.id = 'shots-left';
    shotsLeftP.innerText = shotsLeft;
    infoPanelEl.appendChild(shotsLeftP);

}

function fillGameGridAndObjects() {
    ships = [
    {name: 'Aircraft Carrier', size: 5, image: 'assets/aircraft-carrier.png', damage: 0, id: 'aircraft-carrier'},
    {name: 'Battleship', size: 4, image: 'assets/battleship.png', damage: 0, id: 'battleship'},
    {name: 'Submarine', size: 3, image: 'assets/submarine.png', damage: 0, id: 'submarine'},
    {name: 'Cruiser', size: 3, image: 'assets/cruiser.png', damage: 0, id: 'cruiser'},
    {name: 'Destroyer', size: 2, image: 'assets/destroyer.png', damage: 0, id: 'destroyer'},
    ];

    sunkShipsCount = 0;
    gridObject = {};
    console.log(gridObject);
    let id = 0;
    for (let rowNum = 1; rowNum <= 10; rowNum++) {
        let rowEl = document.createElement('div');
        rowEl.className = "row";
        gameboardEl.appendChild(rowEl);
        gridObject[rowNum] = {};
        for (let colNum = 1; colNum <= 10; colNum++) {
            let squareEl = document.createElement('div');
            squareEl.className = "square";
            id++;
            squareEl.id = id;
            rowEl.appendChild(squareEl);
            gridObject[rowNum][colNum] = 'none';
            squareEl.addEventListener('click', (event) => {
            gameboardClick(rowNum, colNum);
            });
        };
    };
};

function placeShips() {
    for (let ship of ships) {
        findOpenSpot(ship);
    };
};

function setOrientation() {
    let random0to1 = Math.floor(Math.random() * 2);
    if (random0to1 == 0) { 
        orientation = "vertical";
    } else if (random0to1 == 1) { 
        orientation = "horizontal";
    };
}

function getRandoms(ship) {
    if (orientation == 'vertical') {
        randRow = Math.floor(Math.random() * (10 - ship.size) + 1);
        randCol = Math.floor(Math.random() * 10 + 1);
    } else if (orientation == 'horizontal') {
        randCol = Math.floor(Math.random() * (10 - ship.size) + 1);
        randRow = Math.floor(Math.random() * 10 + 1);
    };
}

function findOpenSpot(ship) {
    setOrientation();
    getRandoms(ship);
    noneCount = 0;
    if (orientation == 'vertical') {
        for (let k = 0; k < ship.size; k++) {
            if (gridObject[randRow + k][randCol] == 'none') {
            noneCount++
            };
        };
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


function fillShipPanel() {
    for (let ship of ships) {
        shipImage = document.createElement('img');
        shipImage.src = ship.image;
        shipImage.className = 'ship-image';
        shipImageDiv = document.createElement('div');
        shipImageDiv.className = 'ship-image-div';
        shipImageDiv.id = ship.id;
        shipDescriptionDiv = document.createElement('div');
        shipDescriptionDiv.className = 'ship-description-div';
        shipNameP = document.createElement('p');
        shipNameP.innerText = ship.name;
        shipSizeP = document.createElement('p');
        shipSizeP.innerText = 'Size: ' + ship.size;
        redOverlayDiv = document.createElement('div');
        redOverlayDiv.className = "red-overlay-div";
        shipPanelEl.appendChild(shipDescriptionDiv);
        shipPanelEl.appendChild(shipImageDiv);
        shipDescriptionDiv.appendChild(shipNameP);
        shipDescriptionDiv.appendChild(shipSizeP);
        shipImageDiv.appendChild(redOverlayDiv);
        shipImageDiv.appendChild(shipImage);
    };

};

function gameboardClick(rowNum, colNum) {
    clickedSquare = event.target
    if (gridObject[rowNum][colNum] == 'none') {
        miss(rowNum, colNum, clickedSquare);
    } else if (gridObject[rowNum][colNum] != 'none' && (gridObject[rowNum][colNum] != 'closed')) {
        hit(rowNum, colNum, clickedSquare);
    }
    let shotsLeftP = document.getElementById('shots-left'); 
    shotsLeftP.innerText = shotsLeft;
};

function miss(rowNum, colNum, clickedSquare) {
    gridObject[rowNum][colNum] = 'closed';
    clickedSquare.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    shotsLeft--;
    splash.play();
    checkGameStatus();
};

function hit(rowNum, colNum, clickedSquare) {
    hitShip = gridObject[rowNum][colNum];
    shotsLeft--;
    for (let ship of ships) {
        if (hitShip == ship.id) {
            ship.damage++
            sinkCheck(ship);
        }
    };
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
    let sunkShip = document.getElementById(ship.id);
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
    let youLose = document.createElement('p');
    youLose.innerText = 'YOU LOSE!'
    youLose.className = 'win-lose';
    mainEl.appendChild(youLose);   
};

function win() {
    closeGameboard();
    let youWin = document.createElement('p');
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