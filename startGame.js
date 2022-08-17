const start = document.getElementById('startGame');
const startbtn = document.getElementById('startbtn');
const p1C = document.getElementById('p1Color');
const p2C = document.getElementById('p2Color');
const p1N = document.getElementById('p1Name');
const p2N = document.getElementById('p2Name');
start.addEventListener('submit', startGame);

function disableform() {
    startbtn.toggleAttribute('disabled');
    p1C.toggleAttribute('disabled');
    p2C.toggleAttribute('disabled');
    p1N.toggleAttribute('disabled');
    p2N.toggleAttribute('disabled');
}
function startGame(evt) {
    evt.preventDefault();
    p1Name = p1N.value || 'Player One';
    p2Name = p2N.value || 'Player Two';
    p1Color = p1C.value || 'purple';
    p2Color = p2C.value || 'green';
    const newGame = new Game();
    newGame.play(p1Name, p1Color, p2Name, p2Color);
    disableform();
}

function highlight(cells) {
    cells.forEach(([y, x]) => {
        document.getElementById(`${y}-${x}`)
            .firstElementChild
            .classList
            .add('won');
    })
}