/* WATS 3020 Browser Game project */
/* Build a tic tac toe game for two players. */

class Player {
    constructor(token) {
        this.token = token;
    }
}

class TicTacToe {
    constructor() {
        this.player1 = new Player('remove-sign');
        this.player2 = new Player('unchecked');
        this.currentPlayer = null;
        this.gameStatus = null;
        this.winner = null;
        this.moveCount = 0;
        this.startPrompt = document.querySelector("#start-prompt");
        this.movePrompt = document.querySelector("#move-prompt");
        this.currentPlayerToken = document.querySelector("#player-token");
        this.gameboard = document.querySelector("#gameboard");
        this.winScreen = document.querySelector("#win-screen");
        this.winnerToken = document.querySelector("#winnerToken");
        this.drawScreen = document.querySelector("#draw-screen");


        this.gameState = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        this.winStates = [
            [
                [0, 0],
                [0, 1],
                [0, 2]
            ],
            [
                [1, 0],
                [1, 1],
                [1, 2]
            ],
            [
                [2, 0],
                [2, 1],
                [2, 2]
            ],
            [
                [0, 0],
                [1, 0],
                [2, 0]
            ],
            [
                [0, 1],
                [1, 1],
                [2, 1]
            ],
            [
                [0, 2],
                [1, 2],
                [2, 2]
            ],
            [
                [0, 0],
                [1, 1],
                [2, 2]
            ],
            [
                [0, 2],
                [1, 1],
                [2, 0]
            ]
        ];
    }

    checkForWinner() {
        console.log('check for winner.')
        for (let condition of this.winStates) {
            let winningCondition = true;
            for (let position of condition) {
                if (this.gameState[position[0]][position[1]] != this.currentPlayer.token) {
                    winningCondition = false;
                }
            }
            if (winningCondition) {
                console.log('We have a winner!');
                console.log(`Condition is: ${condition}`);
                this.gameStatus = 'won';
                this.winner = this.currentPlayer;

                let winEvent = new Event('win');
                document.dispatchEvent(winEvent);
                return true;
            }
        }
        this.moveCount++;
        console.log(`Reviewed move ${this.moveCount}.`)
        if (this.moveCount >= 9) {
            console.log(`This game is a draw at ${this.moveCount} moves.`);
            this.gameStatus = 'draw';
            let drawEvent = new Event('draw');
            document.dispatchEvent(drawEvent);
        }
    }

    recordMove(event) {
        console.log('Recording move');
        // event target is tile itself
        let tileX = event.target.dataset.x;
        let tileY = event.target.dataset.y;
        this.gameState[tileX][tileY] = this.currentPlayer.token; // Stretch Goal: insert inside of a conditional in order to stop processing if spot is already claimed
        event.target.setAttribute('class', `tile played glyphicon glyphicon-${this.currentPlayer.token}`);
    }

    switchPlayer() {
        console.log('Switching player');
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }
        this.currentPlayerToken.setAttribute('class', `glyphicon glyphicon-${this.currentPlayer.token}`);
    }

    setUpTileListeners() {
        console.log('Setting up tile listeners.');

        let tileElements = document.querySelectorAll('.tile');
        for (let tile of tileElements) {
            // only the name of function needs to be given since calling it is being performed by the listener
            tile.addEventListener('click', handleMove)

        }
    }

    showWinScreen() {
        console.log('Showing win screen.');
        this.winScreen.setAttribute('class', 'show');
        this.winnerToken.setAttribute('class', `glyphicon glyphicon-${this.currentPlayer.token}`);
    }

    showDrawScreen() {
        console.log('Showing draw screen.')
        this.drawScreen.setAttribute('class', 'show');
    }

    setUpBoard() {
        console.log('Setting up game board');

        this.gameboard.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            let newRow = document.createElement('div');
            newRow.setAttribute('class', 'row');
            for (let j = 0; j < 3; j++) {
                let newCol = document.createElement('div');
                newCol.setAttribute('class', 'col-xs-3');
                let newTile = document.createElement('span');
                newTile.setAttribute('class', 'tile glyphicon glyphicon-question-sign');
                newTile.dataset.x = i;
                newTile.dataset.y = j;
                newCol.appendChild(newTile);
                // cols appended to rows, rows appended to board
                newRow.appendChild(newCol);
                this.gameboard.appendChild(newRow);
            }
        }

        this.setUpTileListeners()

    }

    initializeMovePrompt() {
        console.log('Initializing move prompt');

        this.startPrompt.setAttribute('class', 'hidden');
        this.movePrompt.setAttribute('class', '');
        this.currentPlayer = this.player1;
        this.currentPlayerToken.setAttribute('class', `glyphicon glyphicon-${this.currentPlayer.token}`);
    }
    start() {
        console.log('starting game');
        this.setUpBoard();
        this.initializeMovePrompt();
    }
}

let game;
console.log('Game code starting.');

document.addEventListener('DOMContentLoaded', function(event) {
    console.log('DOM content loaded.');
    let startButton = document.querySelector('#start-button');
    startButton.addEventListener('click', function() {
        game = new TicTacToe();
        game.start();
    })

});

document.addEventListener('win', function(event) {
    console.log('Detected win event.');
    game.showWinScreen();
});

document.addEventListener('draw', function(event) {
    console.log('Detected draw event.');
    game.showDrawScreen();
});

function handleMove(event) {
    console.log('Handling player move.');
    game.recordMove(event);
    game.checkForWinner();
    game.switchPlayer();
}