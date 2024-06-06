function rollDice() {
    const dice = document.getElementById('dice');
    let result;
    let count = 0;

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
    // Aquí puedes añadir la lógica para guardar el resultado
}