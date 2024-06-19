const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const snakeSize = 20; // Size of the snake's segment
let snake = [
    {x: 160, y: 200}, // Head of the snake
    {x: 140, y: 200}, // Body segment of the snake
    {x: 120, y: 200}  // Tail of the snake
];
let dx = snakeSize;
let dy = 0;
let foodX;
let foodY;
let leaderboard = [];
let currentScore = 0;
let playerName = '';

document.addEventListener("keydown", changeDirection);
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('startButton').addEventListener('click', startGame);

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'green'; // Color of the snake
    ctx.strokestyle = 'darkgreen'; // Border color of the snake
    ctx.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize); // Draws a filled rectangle to represent the snake part
    ctx.strokeRect(snakePart.x, snakePart.y, snakeSize, snakeSize); // Draws a border around the snake part
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / snakeSize) * snakeSize;
}

function createFood() {
    foodX = randomTen(0, canvas.width - snakeSize);
    foodY = randomTen(0, canvas.height - snakeSize);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokestyle = 'darkred';
    ctx.fillRect(foodX, foodY, snakeSize, snakeSize);
    ctx.strokeRect(foodX, foodY, snakeSize, snakeSize);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (snake[0].x === foodX && snake[0].y === foodY) {
        currentScore += 10;
        createFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -snakeSize;
    const goingDown = dy === snakeSize;
    const goingRight = dx === snakeSize;
    const goingLeft = dx === -snakeSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -snakeSize;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -snakeSize;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = snakeSize;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = snakeSize;
    }
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - snakeSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - snakeSize;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}
function clearLeaderboard() {
    // Clear the leaderboard array
    leaderboard = [];
    // Save the empty leaderboard to localStorage
    saveLeaderboard();
    // Update the leaderboard display
    updateLeaderboard();
    alert('Leaderboard cleared!');
}
document.getElementById('clearLeaderboardButton').addEventListener('click', clearLeaderboard);
function updateLeaderboard() {
    leaderboard.push({name: playerName, score: currentScore});
    leaderboard.sort((a, b) => b.score - a.score);
    saveLeaderboard();

    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';

    leaderboard.forEach((entry, index) => {
        const scoreElement = document.createElement('li');
        scoreElement.innerHTML = `<span>#${index + 1}</span> ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(scoreElement);
    });

    alert(`Game Over! Your score: ${currentScore}`);
}

function saveLeaderboard() {
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function loadLeaderboard() {
    const storedLeaderboard = localStorage.getItem('leaderboard');
    if (storedLeaderboard) {
        leaderboard = JSON.parse(storedLeaderboard);
    }
}

function restartGame() {
    snake = [
        {x: 160, y: 200},
        {x: 140, y: 200},
        {x: 120, y: 200}
    ];
    dx = snakeSize;
    dy = 0;
    currentScore = 0;
    createFood();
    main();
}

function main() {
    if (didGameEnd()) {
        updateLeaderboard();
        return;
    }

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, 100);
}

function startGame() {
    const nameInput = document.getElementById('playerName');
    if (nameInput.value.trim() === '') {
        alert('Please enter your name.');
        return;
    }

    playerName = nameInput.value;
    document.getElementById('playerModal').style.display = 'none';
    restartGame();
}

// Initial game setup
loadLeaderboard();
document.getElementById('playerModal').style.display = 'block';
