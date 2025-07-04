const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreText = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreText = document.getElementById('final-score');

let score = 0;
let gameRunning = true;
let speed = 3000; // Initial fall duration

function randomX() {
  return Math.floor(Math.random() * (window.innerWidth - 50));
}

function createBlock() {
  if (!gameRunning) return;

  const block = document.createElement('div');
  const isRed = Math.random() < 0.7; // 70% red, 30% yellow
  block.classList.add('block', isRed ? 'red' : 'yellow');
  block.style.left = randomX() + 'px';
  block.style.animationDuration = `${speed}ms`;
  game.appendChild(block);

  const fallInterval = setInterval(() => {
    const blockRect = block.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Collision
    if (
      blockRect.top < playerRect.bottom &&
      blockRect.bottom > playerRect.top &&
      blockRect.left < playerRect.right &&
      blockRect.right > playerRect.left
    ) {
      if (block.classList.contains('red')) {
        gameOver();
      } else {
        score += 5;
        scoreText.innerText = "Score: " + score;
        block.remove();
        clearInterval(fallInterval);
      }
    }

    if (blockRect.top >= window.innerHeight) {
      if (block.classList.contains('red')) {
        score += 1;
      }
      scoreText.innerText = "Score: " + score;
      block.remove();
      clearInterval(fallInterval);
    }
  }, 20);

  // Increase difficulty
  if (score > 0 && score % 10 === 0 && speed > 1000) {
    speed -= 200;
  }

  setTimeout(() => createBlock(), Math.random() * 1000 + 500);
}

function movePlayer(dir) {
  const left = parseInt(window.getComputedStyle(player).getPropertyValue("left"));
  if (dir === 'left' && left > 10) {
    player.style.left = (left - 50) + "px";
  } else if (dir === 'right' && left < window.innerWidth - 70) {
    player.style.left = (left + 50) + "px";
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') movePlayer('left');
  if (e.key === 'ArrowRight') movePlayer('right');
});

// Mobile touch controls
document.addEventListener('touchstart', (e) => {
  const touchX = e.touches[0].clientX;
  const screenWidth = window.innerWidth;
  if (touchX < screenWidth / 2) {
    movePlayer('left');
  } else {
    movePlayer('right');
  }
});

function gameOver() {
  gameRunning = false;
  finalScoreText.innerText = score;
  gameOverScreen.style.display = 'block';
}

function restartGame() {
  window.location.reload();
}

createBlock(); // Start the game
