document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('game-board');
    const alertContainer = document.getElementById('alert-container');
    const rollButton = document.getElementById('roll-button');
    let bearBotPosition = {row: 4, col: 0}; // Posición inicial en la parte izquierda inferior
    let remainingMoves = 0;
    let diceRolling = false;
    const rows = 5;
    const cols = 7;
    const images = ['../media/OBS 1.svg', '../media/OBS 2.svg'];
    const startEndPositions = [[4, 0, '../media/OSO CABEZA.svg', 'INICIO'], [0, 6, '../media/NAVE+BEARBOT.svg', 'FIN']]; // Ajusta la posición de inicio y fin

    function createBoard() {
        gameBoard.innerHTML = ''; // Limpiar tablero
    
        // Crear las celdas del tablero
        for (let i = 0; i < rows * cols; i++) {
            const col = document.createElement('div');
            col.classList.add('board-cell');
            gameBoard.appendChild(col);
        }
    
        placeStartEndPositions();
        placeRandomAliens();
    }

    function placeStartEndPositions() {
        startEndPositions.forEach(pos => {
            const index = pos[0] * cols + pos[1];
            const cell = gameBoard.children[index];
            const img = document.createElement('img');
            img.src = pos[2];
            img.alt = pos[2].split('/').pop().split('.')[0];
            img.classList.add('img-fluid');
            cell.appendChild(img);
            const p = document.createElement('p');
            p.textContent = pos[3];
            cell.appendChild(p);
        });
    }

    function placeRandomAliens() {
        const availableCells = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if ((i !== bearBotPosition.row || j !== bearBotPosition.col) && !(i === 0 && j === 6)) {
                    availableCells.push({row: i, col: j});
                }
            }
        }

        // Crear camino seguro al final
        const pathToFinish = [
            {row: 4, col: 0}, {row: 4, col: 1}, {row: 4, col: 2}, {row: 4, col: 3}, {row: 4, col: 4}, {row: 4, col: 5}, {row: 4, col: 6},
            {row: 3, col: 6}, {row: 2, col: 6}, {row: 1, col: 6}, {row: 0, col: 6}
        ];
        const safePathCells = pathToFinish.map(pos => `${pos.row}-${pos.col}`);
        const filteredCells = availableCells.filter(cell => !safePathCells.includes(`${cell.row}-${cell.col}`));
        
        const numberOfAliens = Math.floor(Math.random() * 2) + 7; // entre 4 y 5 aliens
        for (let i = 0; i < numberOfAliens; i++) {
            const cellIndex = Math.floor(Math.random() * filteredCells.length);
            const cellPos = filteredCells.splice(cellIndex, 1)[0];
            const index = cellPos.row * cols + cellPos.col;
            const cell = gameBoard.children[index];
            const imgIndex = Math.floor(Math.random() * images.length);
            const img = document.createElement('img');
            img.src = images[imgIndex];
            img.alt = 'Alien';
            img.classList.add('img-fluid');
            cell.appendChild(img);
        }
    }

    createBoard();

    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert-custom ${type}`;
        alert.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        alertContainer.appendChild(alert);
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 2000);
    }

    function rollDice() {
        const dice = document.getElementById('dice');
        let result;
        let count = 0;
        diceRolling = true;
        rollButton.disabled = true;

        const interval = setInterval(() => {
            result = Math.floor(Math.random() * 6) + 1;
            dice.src = `../media/dado/${result}.svg`;
            count++;
            if (count === 20) {
                clearInterval(interval);
                saveResult(result);
            }
        }, 100);
    }

    function saveResult(result) {
        console.log(`El resultado del dado es: ${result}`);
        remainingMoves = result;
        diceRolling = false;
        rollButton.disabled = false;
    }

    document.addEventListener('keydown', function(event) {
        if (diceRolling || remainingMoves <= 0) return;

        let newRow = bearBotPosition.row;
        let newCol = bearBotPosition.col;

        switch (event.key) {
            case 'ArrowUp':
                newRow = Math.max(0, bearBotPosition.row - 1);
                break;
            case 'ArrowDown':
                newRow = Math.min(rows - 1, bearBotPosition.row + 1);
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, bearBotPosition.col - 1);
                break;
            case 'ArrowRight':
                newCol = Math.min(cols - 1, bearBotPosition.col + 1);
                break;
        }

        if (newRow !== bearBotPosition.row || newCol !== bearBotPosition.col) {
            const oldIndex = bearBotPosition.row * cols + bearBotPosition.col;
            const newIndex = newRow * cols + newCol;
            const oldCell = gameBoard.children[oldIndex];
            const newCell = gameBoard.children[newIndex];

            // Verificar si el nuevo lugar es el final antes de verificar si es un alien
            if (newCell.children.length > 1 && newCell.children[1].textContent === 'FIN') {
                // Llegó al final
                showAlert('¡Felicidades! Has llegado al final.', 'success');
                setTimeout(() => {
                    resetGame();
                }, 2000);
            } else if (newCell.children.length > 0 && newCell.children[0].alt !== 'Alien') {
                // Chocó con un alien
                showAlert('¡Perdiste! Has chocado con un alien.', 'danger');
                setTimeout(() => {
                    resetGame();
                }, 2000);
            } else {
                newCell.appendChild(oldCell.removeChild(oldCell.children[0]));
                bearBotPosition = {row: newRow, col: newCol};
                remainingMoves--;
            }
        }
    });

    function resetGame() {
        bearBotPosition = {row: 4, col: 0}; // Reinicia la posición del oso
        remainingMoves = 0;
        createBoard();
    }

    // Exponer la función rollDice globalmente
    window.rollDice = rollDice;
});