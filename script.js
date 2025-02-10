// from youtube video: https://www.youtube.com/watch?v=uyhzCBEGaBY

// defin HTLM elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highscore');

// define game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStartrd = false;

// draw game map. snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updatedScore();
}

// draw snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className
    return element;
}

// set the position of the snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// test draw function
// draw();

// draw food function
function drawFood() {
    if (gameStartrd){
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food)
        board.appendChild(foodElement);
    }
}

// generate food position
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
};

// moving the snake
function move() {
    const head = { ...snake[0] };
    switch(direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break; 
        case 'down':
            head.y++;
            break;
        case 'up':
            head.y--;
            break;
    }

    snake.unshift(head);

    // snake.pop();

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); // clear past interval
        gameInterval = setInterval(() => {
            move(); // move the snake
            checkCollision();
            draw(); // draw the snake new position
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
} 

// test move function
// setInterval(() => {
//     move(); // move the snake
//     draw(); // draw the snake new position
// }, 200);

// start game function
function startGame() {
    gameStartrd = true // keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// kepress event listener
function handleKeyPress(event) {
    if (
        (!gameStartrd && event.code === 'Space') || 
        (!gameStartrd && event.key === ' ')) {
        startGame();
    } else {
        switch(event.key) {
            case 'ArrowUp': 
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    clearInterval(gameInterval);
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updatedScore();
    
}

function updatedScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
    clearInterval(gameInterval);
    gameStartrd = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}
