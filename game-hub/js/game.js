// Neon Space Dodge Game Logic

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const finalScoreEl = document.getElementById('final-score');
const gameOverScreen = document.getElementById('game-over-screen');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const saveScoreBtn = document.getElementById('save-score-btn');
const playerNameInput = document.getElementById('player-name');

// Resize canvas
canvas.width = 800;
canvas.height = 600;

// Game State
let isPlaying = false;
let score = 0;
let time = 0;
let frames = 0;
let gameSpeed = 5;
let obstacles = [];
let particles = [];
let timerInterval;

// Player Ship
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    color: '#00e5ff',
    speed: 7,
    dx: 0
};

// Controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') player.dx = -player.speed;
    if (e.key === 'ArrowRight' || e.key === 'd') player.dx = player.speed;
});

document.addEventListener('keyup', (e) => {
    if (
        (e.key === 'ArrowLeft' || e.key === 'a') && player.dx < 0 ||
        (e.key === 'ArrowRight' || e.key === 'd') && player.dx > 0
    ) {
        player.dx = 0;
    }
});

// Obstacle Class
class Obstacle {
    constructor() {
        this.width = Math.random() * 50 + 20;
        this.height = Math.random() * 20 + 20;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.color = Math.random() > 0.5 ? '#9d00ff' : '#ff0055'; // Deep Purple or Neon Red
        this.speed = Math.random() * 3 + gameSpeed;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }
}

// Particle System for Explosion
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.color = color;
        this.life = 30; // frames
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function spawnObstacle() {
    if (frames % 40 === 0) { // Spawn rate
        obstacles.push(new Obstacle());
    }
}

function updateGame() {
    if (!isPlaying) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frames++;

    // Player Movement
    player.x += player.dx;

    // Boundaries
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Draw Player
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = player.color;
    // Draw Triangle Ship
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.moveTo(player.x, player.y + player.height);
    ctx.moveTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Obstacles
    spawnObstacle();
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        obstacles[i].draw();

        // Collision Detection
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            gameOver();
        }

        // Remove off-screen obstacles & update score
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score += 10;
            scoreEl.innerText = 'Score: ' + score;
            i--;
        }
    }

    // Increase difficulty
    if (frames % 500 === 0) gameSpeed += 0.5;

    requestAnimationFrame(updateGame);
}

function startGame() {
    startBtn.style.display = 'none';
    gameOverScreen.style.display = 'none';

    // Reset state
    isPlaying = true;
    score = 0;
    time = 0;
    frames = 0;
    gameSpeed = 5;
    obstacles = [];
    player.x = canvas.width / 2 - 20;
    scoreEl.innerText = 'Score: 0';
    timerEl.innerText = 'Time: 0s';

    // Start Timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        time++;
        timerEl.innerText = 'Time: ' + time + 's';
    }, 1000);

    updateGame();
}

function gameOver() {
    isPlaying = false;
    clearInterval(timerInterval);

    // Create explosion effect (visual only for now)

    gameOverScreen.style.display = 'block';
    finalScoreEl.innerText = score;
}

// Leaderboard Logic
saveScoreBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim() || 'Anonymous';
    const newScore = { name, score, date: new Date().toLocaleDateString() };

    let leaderboard = JSON.parse(localStorage.getItem('neonGridLeaderboard')) || [];
    leaderboard.push(newScore);
    leaderboard.sort((a, b) => b.score - a.score); // Sort desc
    leaderboard = leaderboard.slice(0, 10); // Keep top 10

    localStorage.setItem('neonGridLeaderboard', JSON.stringify(leaderboard));

    alert('Score Saved!');
    window.location.href = 'leaderboard.html';
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Initial Screen Draw
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#00e5ff';
ctx.font = '20px Orbitron';
ctx.fillText('Press Start to Play', canvas.width / 2 - 100, canvas.height / 2);
