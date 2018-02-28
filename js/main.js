/* WATS 3020 Browser Game project */
/* Build a tic tac toe game for two players. */

// Create Player class with token parameter passed to constructor function
class Player {
    constructor(token) {
        this.token = token;
    }
}

// Create game class to set the board, players, states, and game function-ality
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

        // starting state 
        this.gameState = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        // possible win states
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
        // Check to see if game state matches a win state
        console.log('Checking for winner.')
        for (let condition of this.winStates) {
            let winningCondition = true;
            for (let position of condition) {
                // if current game state matches none of the win state set winning condition to false
                if (this.gameState[position[0]][position[1]] != this.currentPlayer.token) {
                    winningCondition = false;
                }
            }
            // Otherwise, with winning condition being true, set game status to won for current player
            if (winningCondition) {
                console.log('We have a winner!');
                console.log(`Condition is: ${condition}`); // log win state
                this.gameStatus = 'won';
                this.winner = this.currentPlayer;
                // Dispatch win event so win window can be invoked
                let winEvent = new Event('win');
                document.dispatchEvent(winEvent);
                return true;
            }
        }
        // Begin move count
        this.moveCount++;
        console.log(`Reviewed move ${this.moveCount}.`)
            // Check if max number of moves has been reached based on move count
        if (this.moveCount >= 9) {
            console.log(`This game is a draw at ${this.moveCount} moves.`);
            // Set game to a draw if all 9 tiles are assigned w/o winner
            this.gameStatus = 'draw';
            // Dispatch as event so draw window can be invoked
            let drawEvent = new Event('draw');
            document.dispatchEvent(drawEvent);
        }
    }

    recordMove(event) {
        console.log('Recording move');
        // Set the tile played to the correct glyphicon (event target is tile itself)
        let tileX = event.target.dataset.x;
        let tileY = event.target.dataset.y;
        this.gameState[tileX][tileY] = this.currentPlayer.token; // Stretch Goal: insert inside of a conditional in order to stop processing if spot is already claimed
        event.target.setAttribute('class', `tile played glyphicon glyphicon-${this.currentPlayer.token}`);
    }

    switchPlayer() {
        console.log('Switching player');
        // Check if current player is player1 and if it is, change current player to player2, otherwise change to player1
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }
        // Assign correct glyphicon to the class attribute of the currentPlayerToken element
        this.currentPlayerToken.setAttribute('class', `glyphicon glyphicon-${this.currentPlayer.token}`);
    }


    setUpTileListeners() {
            console.log('Setting up tile listeners.');
            // Add event listeners to all tile elements
            let tileElements = document.querySelectorAll('.tile');
            for (let tile of tileElements) {
                // only the name of function needs to be given since calling it is being performed by the listener
                tile.addEventListener('click', handleMove)

            }
        }
        // Show win popup
    showWinScreen() {
        console.log('Showing win screen.');
        this.winScreen.setAttribute('class', 'show');
        this.winnerToken.setAttribute('class', `glyphicon glyphicon-${this.currentPlayer.token}`);
    }

    // Show the draw popup
    showDrawScreen() {
        console.log('Showing draw screen.')
        this.drawScreen.setAttribute('class', 'show');
    }

    setUpBoard() {
        console.log('Setting up game board');
        // Empty where game will appear
        this.gameboard.innerHTML = '';
        // Create three rows and three columns
        for (let i = 0; i < 3; i++) {
            let newRow = document.createElement('div');
            newRow.setAttribute('class', 'row');
            for (let j = 0; j < 3; j++) {
                let newCol = document.createElement('div');
                newCol.setAttribute('class', 'col-xs-3');
                // allow create of newTile spans with dataset property in order to handle xy values                
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
        // Invoke method for setting up the tile listener friends
        this.setUpTileListeners()

    }

    initializeMovePrompt() {
        console.log('Initializing move prompt');
        // This is called after the "Start Game" button is selected and it sets le scene
        this.startPrompt.setAttribute('class', 'hidden');
        this.movePrompt.setAttribute('class', '');
        this.currentPlayer = this.player1;
        this.currentPlayerToken.setAttribute('class', `glyphicon glyphicon-${this.currentPlayer.token}`);
    }
    start() {
        console.log('starting game');
        // Adds empty board and prompt player1 to move
        this.setUpBoard();
        this.initializeMovePrompt();
    }
}

let game;
console.log('Game code starting.');

// Add event listener to start button once DOM content is loaded
document.addEventListener('DOMContentLoaded', function(event) {
    console.log('DOM content loaded.');
    let startButton = document.querySelector('#start-button');
    // set click attribute to the anonymous function containing a new instance of the class game and invoke it's start method
    startButton.addEventListener('click', function() {
        game = new TicTacToe();
        game.start();
    })

});

// Add event listener to detect win event and invoke win screen
document.addEventListener('win', function(event) {
    console.log('Detected win event.');
    game.showWinScreen();
});


// Add event listener to detect draw event and invoke draw screen
document.addEventListener('draw', function(event) {
    console.log('Detected draw event.');
    game.showDrawScreen();
});

// Add event listener to record a player's move, check to see if they are a winner and if not, switch players
function handleMove(event) {
    console.log('Handling player move.');
    game.recordMove(event);
    game.checkForWinner();
    game.switchPlayer();
}