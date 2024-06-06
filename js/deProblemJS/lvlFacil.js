document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('game-board');
    const alertContainer = document.getElementById('alert-container');
    const rollButton = document.getElementById('roll-button');
    let bearBotPosition = {row: 3, col: 0};
    let remainingMoves = 0;
    let diceRolling = false;
    const rows = 4;
    const cols = 4;
    const images = ['../media/OBS 1.svg', '../media/OBS 2.svg'];
    const startEndPositions = [[3, 0, '../media/OSO CABEZA.svg', 'INICIO'], [0, 3, '../media/NAVE+BEARBOT.svg', 'FIN']];
    
    const safePaths = [
        [{row: 2, col: 0}, {row: 2, col: 1}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 0, col: 2}],
        [{row: 2, col: 0}, {row: 2, col: 1}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}],
        [{row: 2, col: 0}, {row: 1, col: 0}, {row: 1, col: 1}, {row: 0, col: 1}, {row: 0, col: 2}],
        [{row: 2, col: 0}, {row: 1, col: 0}, {row: 1, col: 1}, {row: 2, col: 2}, {row: 2, col: 3}, {row: 1, col: 3}],
        [{row: 3, col: 1}, {row: 2, col: 1}, {row: 1, col: 1}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}],
        [{row: 3, col: 1}, {row: 2, col: 1}, {row: 2, col: 2}, {row: 1, col: 2}, {row: 0, col: 2}, {row: 0, col: 3}],
        [{row: 3, col: 1}, {row: 3, col: 2}, {row: 2, col: 2}, {row: 1, col: 2}, {row: 1, col: 3}, {row: 0, col: 3}],
        [{row: 3, col: 1}, {row: 3, col: 2}, {row: 3, col: 3}, {row: 2, col: 3}, {row: 1, col: 3}, {row: 0, col: 3}]
    ];

    function createBoard() {
        gameBoard.innerHTML = '';

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
                if ((i !== bearBotPosition.row || j !== bearBotPosition.col) && !(i === 0 && j === 3)) {
                    availableCells.push({row: i, col: j});
                }
            }
        }

        const randomSafePath = safePaths[Math.floor(Math.random() * safePaths.length)];
        const safePathCells = randomSafePath.map(pos => `${pos.row}-${pos.col}`);
        const filteredCells = availableCells.filter(cell => !safePathCells.includes(`${cell.row}-${cell.col}`));

        const numberOfAliens = Math.min(filteredCells.length, Math.floor(Math.random() * 2) + 5);
        for (let i = 0; i < numberOfAliens; i++) {
            if (filteredCells.length === 0) break;
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

    function showFinalMessage(message, type, redirect = false) {
        const finalMessage = document.createElement('div');
        finalMessage.className = `final-message ${type}`;
        finalMessage.innerHTML = `
            <div class="message-content">
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(finalMessage);
        setTimeout(() => {
            finalMessage.remove();
            if (redirect) {
                window.location.href = 'medioProblm.html';
            } else {
                resetGame();
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

            if (newCell.children.length > 1 && newCell.children[1].textContent === 'FIN') {
                showFinalMessage('¡Felicidades! Has llegado al final.', 'success', true);
            } else if (newCell.children.length > 0 && newCell.children[0].alt === 'Alien') {
                showFinalMessage('¡Perdiste! Has chocado con un alien.', 'danger');
            } else {
                newCell.appendChild(oldCell.removeChild(oldCell.children[0]));
                bearBotPosition = {row: newRow, col: newCol};
                remainingMoves--;
            }
        }
    });

    function resetGame() {
        bearBotPosition = {row: 3, col: 0};
        remainingMoves = 0;
        createBoard();
    }

    window.rollDice = rollDice;
});