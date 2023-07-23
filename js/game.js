// JavaScript-код

const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.querySelector(".game-score");
const startButton = document.querySelector(".game-start");
const resetButton = document.querySelector(".game-reset");
const gameOverMessage = document.querySelector(".game-over");

const segmentSize = 10;
const snakeSpeed = 100; // Встановіть бажану швидкість руху змійки тут (менше значення - швидше).

let snake = [
  { x: 100, y: 100 },
  { x: 90, y: 100 },
];

let food = { x: 200, y: 200 };
let dx = segmentSize;
let dy = 0;
let score = 0;
let isGameRunning = false;

// Зображення змійки та їжі
const snakeImg = new Image();
snakeImg.src = "img/snake.png"; // Замініть "path_to_your_snake_image.png" шляхом до вашого зображення змійки.

const foodImg = new Image();
foodImg.src = "img/cherry.png"; // Замініть "path_to_your_food_image.png" шляхом до вашого зображення їжі.

function drawSnake() {
  snake.forEach((segment) => {
    ctx.drawImage(snakeImg, segment.x, segment.y, segmentSize, segmentSize);
  });
}

function drawFood() {
  ctx.drawImage(foodImg, food.x, food.y, segmentSize, segmentSize);
}

function update() {
  if (!isGameRunning) return;

  // Оновлення позиції змійки
  const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(newHead);

  // Перевірка, чи зіткнулась змійка з їжею
  if (newHead.x === food.x && newHead.y === food.y) {
    score += 10;
    scoreDisplay.textContent = `Очки: ${score}`;
    generateFood();
  } else {
    snake.pop(); // Видаляємо хвіст, якщо змійка не з'їла їжу.
  }

  // Перевірка зіткнення змійки зі стінами або з собою
  if (isCollision()) {
    gameOver();
    return;
  }

  drawCanvas();
  setTimeout(update, snakeSpeed);
}

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
}

function generateFood() {
  food.x = getRandomCoordinate(canvas.width - segmentSize);
  food.y = getRandomCoordinate(canvas.height - segmentSize);
}

function getRandomCoordinate(max) {
  return Math.floor((Math.random() * max) / segmentSize) * segmentSize;
}

function isCollision() {
  const head = snake[0];
  return (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y)
  );
}

function handleKeyPress(event) {
  if (!isGameRunning) return;

  const keyPressed = event.key;
  const goingUp = dy === -segmentSize;
  const goingDown = dy === segmentSize;
  const goingLeft = dx === -segmentSize;
  const goingRight = dx === segmentSize;

  if (keyPressed === "ArrowUp" && !goingDown) {
    dx = 0;
    dy = -segmentSize;
  }
  if (keyPressed === "ArrowDown" && !goingUp) {
    dx = 0;
    dy = segmentSize;
  }
  if (keyPressed === "ArrowLeft" && !goingRight) {
    dx = -segmentSize;
    dy = 0;
  }
  if (keyPressed === "ArrowRight" && !goingLeft) {
    dx = segmentSize;
    dy = 0;
  }
}

function startGame() {
  isGameRunning = true;
  startButton.disabled = true;
  resetButton.disabled = true;
  gameOverMessage.style.display = "none";
  update();
}

function resetGame() {
  isGameRunning = false;
  snake = [
    { x: 100, y: 100 },
    { x: 90, y: 100 },
  ];
  dx = segmentSize;
  dy = 0;
  score = 0;
  scoreDisplay.textContent = `Очки: ${score}`;
  startButton.disabled = false;
  resetButton.disabled = false;
  gameOverMessage.style.display = "none";
  drawCanvas();
}

function gameOver() {
  isGameRunning = false;
  gameOverMessage.style.display = "block";
  startButton.disabled = false;
  resetButton.disabled = false;
}

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
document.addEventListener("keydown", handleKeyPress);
drawCanvas();
generateFood();
