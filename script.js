const GameBoard = (() => {

    let gameBoard = Array(9);

    const init = () => {
        gameBoard = Array(9);
    }

    const updateBoard = (square, symbol) => {
        let pos = square.classList.value.slice(-1);
        if (gameBoard[pos] === undefined) gameBoard[pos] = symbol;
        else return false;

        square.textContent = symbol;
        return true;
    }

    const getBoard = () => gameBoard;

    return {
        init,
        updateBoard,
        getBoard,
    };
})();

const player = (name, symbol) => {
    let _symbol = symbol
    let _isActive = false;
    let _name = name;

    const player = document.querySelector(`.player-${symbol}`);

    const getSymbol = () => _symbol;
    const getActive = () => _isActive;
    const getName = () => _name;
    const toggleActive = () => {
        _isActive ? setActive(false) : setActive(true);
    }
    const setActive = (active) => {
        _isActive = active;
        _isActive ? player.classList.add('active') : player.classList.remove('active');
    }

    return {
        getSymbol,
        getActive,
        getName,
        toggleActive,
        setActive,
    };
}


const GameController = (() => {
    const gridSize = 3;
    const player1 = player('p1', 'X');
    const player2 = player('p2', 'O');

    const init = () => {
        player1.setActive(true);
        player2.setActive(false)

        GameBoard.init();
        DisplayController.renderGameBoard(gridSize);
        DisplayController.init();
    }

    function playTurn() {
        const activePLayer = player1.getActive() ? player1 : player2;
        if (!GameBoard.updateBoard(this, activePLayer.getSymbol())) return;
        checkWin();

        player1.toggleActive();
        player2.toggleActive();

        this.classList.add('active')
    }

    const checkWin = () => {
        const gameBoard = GameBoard.getBoard();
        const activePLayer = player1.getActive() ? player1 : player2;

        //Check rows
        let i = 0;
        while (i < gridSize*gridSize) {
            if (gameBoard[i+1] == gameBoard[i] && gameBoard[i+2] == gameBoard[i+1] && gameBoard[i]) {
                DisplayController.endGame(activePLayer);
                return;
            }
            i+=3;
        }

        //Check cols
        i = 0;
        while (i < gridSize*gridSize) {
            if (gameBoard[i+3] == gameBoard[i] && gameBoard[i+6] == gameBoard[i+3] && gameBoard[i]) {
                DisplayController.endGame(activePLayer);
                return;
            }
            i++;
        }

        //Check diag
        if (gameBoard[0] == gameBoard[4] && gameBoard[4] == gameBoard[8] && gameBoard[0]) {
            DisplayController.endGame(activePLayer);
            return;
        }

        //Check anti-diag
        else if (gameBoard[2] == gameBoard[4] && gameBoard[4] == gameBoard[6] && gameBoard[2]) {
            DisplayController.endGame(activePLayer);
            return;
        }

        //Check draw
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === undefined) return;
        }
        DisplayController.endGame(activePLayer, true)
    }


    const restartGame = () => {
        init();
    }

    return {
        playTurn,
        restartGame,
    };

})();



const DisplayController = (() => {
    const $board = document.querySelector('.board');
    const $restartBtn = document.querySelector('.restart.btn');
    
    const init = () => {
        const $squares = document.querySelectorAll('.board div');
        $squares.forEach(square => square.addEventListener('click', GameController.playTurn));
        
        $restartBtn.addEventListener('click', GameController.restartGame);
    }

    const renderGameBoard = (gridSize) => {
        $board.innerHTML = '';
        for (let i = 0; i < gridSize*gridSize; i++) {
            const $div = document.createElement('div');
            $div.classList.add(`index-${i}`);
            $board.appendChild($div);
        }
    }

    const endGame = (winner, draw = false) => {
        if (draw) {console.log('draw');}
        console.log(winner.getName()); 

        $board.childNodes.forEach(square => 
            square.removeEventListener('click', GameController.playTurn));
    }

    return {
        init,
        renderGameBoard,
        endGame,
    };

})();
    
GameController.restartGame();

