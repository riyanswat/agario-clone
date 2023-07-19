class AgarioGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = 40; // Adjust this value to change the grid size
    this.playerRadius = 25; // Adjust this value to change the player's size

    this.playerX = this.canvas.width / 2;
    this.playerY = this.canvas.height / 2;
    this.cursorX = this.playerX;
    this.cursorY = this.playerY;
    this.delay = 0.2; // delay (in seconds)
    this.easingFactor = 0.1; // smoothness

    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.gameLoop();
    this.cursorLoop();
  }

  drawGrid() {
    this.ctx.strokeStyle = '#ddd';
    for (let x = 0; x < this.canvas.width; x += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  drawPlayer() {
    this.ctx.beginPath();
    this.ctx.arc(this.playerX, this.playerY, this.playerRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'blue'; // Adjust player color here
    this.ctx.fill();
    this.ctx.closePath();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateCursor() {
    const dx = this.playerX - this.cursorX;
    const dy = this.playerY - this.cursorY;
    this.cursorX += dx * this.delay;
    this.cursorY += dy * this.delay;
  }

  update() {
    this.clearCanvas();
    this.drawGrid();
    this.updatePlayer();
    this.drawPlayer();
  }

  updatePlayer() {
    const dx = this.cursorX - this.playerX;
    const dy = this.cursorY - this.playerY;
    this.playerX += dx * this.easingFactor;
    this.playerY += dy * this.easingFactor;
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.cursorX = event.clientX - rect.left;
    this.cursorY = event.clientY - rect.top;
  }

  gameLoop() {
    this.update();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  cursorLoop() {
    this.updateCursor();
    requestAnimationFrame(this.cursorLoop.bind(this));
  }
}

// Usage
const agarioGame = new AgarioGame('gameCanvas');
