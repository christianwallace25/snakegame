const gridElement = document.querySelector('.grid');
const width = 10;
let cells = [];
let snake = [{x: 2, y: 0}, {x:1, y:0}, {x:0, y:0}];
let direction = {x: 1, y: 0};
let food = {};
let score = 0;
let timerId;
let intervalTime = 500;

const startButton = document.getElementById('start');
const scoreDisplay = document.getElementById('score');

function createGrid() {
    gridElement.innerHTML = '';
    cells = [];
    for(let y=0; y<width; y++) {
        for(let x=0; x<width; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            gridElement.appendChild(cell);
            cells.push({element: cell, x: x, y: y});
        }
    }
}

function draw() {
    cells.forEach(c => c.element.classList.remove('snake','food'));
    snake.forEach(seg => {
        const cell = cells.find(c => c.x === seg.x && c.y === seg.y);
        if(cell) cell.element.classList.add('snake');
    });
    if(food) {
        const f = cells.find(c => c.x === food.x && c.y === food.y);
        if(f) f.element.classList.add('food');
    }
}

function generateFood() {
    let freeCells = cells.filter(c => !snake.some(s => s.x === c.x && s.y === c.y));
    if(freeCells.length === 0) return;
    const rand = freeCells[Math.floor(Math.random()*freeCells.length)];
    food = {x: rand.x, y: rand.y};
}

function move() {
    const newHead = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    if(newHead.x < 0 || newHead.x >= width || newHead.y < 0 || newHead.y >= width ||
       snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        clearInterval(timerId);
        alert('Game Over! Seu placar: ' + score);
        return;
    }

    snake.unshift(newHead);

    if(food && newHead.x === food.x && newHead.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        generateFood();
        if(intervalTime > 100) {
            intervalTime -= 20;
            clearInterval(timerId);
            timerId = setInterval(move, intervalTime);
        }
    } else {
        snake.pop();
    }

    draw();
}

function startGame() {
    clearInterval(timerId);
    score = 0;
    scoreDisplay.textContent = score;
    snake = [{x: 2, y:0},{x:1,y:0},{x:0,y:0}];
    direction = {x:1, y:0};
    intervalTime = 500;
    generateFood();
    draw();
    timerId = setInterval(move, intervalTime);
}

function control(e) {
    if(e.key === 'ArrowUp' && direction.y !== 1) direction = {x:0, y:-1};
    else if(e.key === 'ArrowDown' && direction.y !== -1) direction = {x:0, y:1};
    else if(e.key === 'ArrowLeft' && direction.x !== 1) direction = {x:-1, y:0};
    else if(e.key === 'ArrowRight' && direction.x !== -1) direction = {x:1, y:0};
}

createGrid();
draw();
document.addEventListener('keydown', control);
startButton.addEventListener('click', startGame);
