const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let paddleHeight = 100, paddleWidth = 10;
let ballRadius = 10;

// Paddle positions
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;

// Ball position and velocity
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballDX = 4, ballDY = 2;

// Player controls
let leftPaddleDY = 0;
let rightPaddleDY = 0;

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

// Draw paddles
function drawPaddles() {
    // Left paddle
    ctx.fillStyle = "white";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

    // Right paddle
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
}

// Move paddles
function movePaddles() {
    leftPaddleY += leftPaddleDY;
    rightPaddleY += rightPaddleDY;

    // Prevent paddles from going out of bounds
    leftPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddleY));
    rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddleY));
}

// Update ball position
function updateBall() {
    ballX += ballDX;
    ballY += ballDY;

    // Collision with top or bottom walls
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballDY *= -1;
    }

    // Collision with paddles
    if (
        ballX - ballRadius < paddleWidth &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        ballDX *= -1;
    }

    if (
        ballX + ballRadius > canvas.width - paddleWidth &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        ballDX *= -1;
    }

    // Reset ball if it goes out of bounds
    if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
        resetBall();
    }
}

// Reset ball position
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballDX = -ballDX; // Send ball towards losing player
    ballDY = 2 * (Math.random() > 0.5 ? 1 : -1); // Randomize vertical direction
}

// Keyboard controls
document.addEventListener("keydown", (event) => {
    if (event.key === "w") leftPaddleDY = -5;
    if (event.key === "s") leftPaddleDY = 5;
    if (event.key === "ArrowUp") rightPaddleDY = -5;
    if (event.key === "ArrowDown") rightPaddleDY = 5;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "w" || event.key === "s") leftPaddleDY = 0;
    if (event.key === "ArrowUp" || event.key === "ArrowDown") rightPaddleDY = 0;
});

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddles();
    movePaddles();
    updateBall();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
