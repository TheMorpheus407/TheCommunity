/**
 * ASCII Doom - Raycasting Game Component
 * A simple Wolfenstein 3D-style raycaster rendering to ASCII
 * Integrated P2P game for TheCommunity chat app
 */
(function (window) {
  'use strict';

  // Game constants
  const MAP_WIDTH = 16;
  const MAP_HEIGHT = 16;
  const RENDER_WIDTH = 80;  // ASCII columns
  const RENDER_HEIGHT = 24; // ASCII rows
  const FOV = Math.PI / 3;  // 60 degrees field of view
  const MAX_DEPTH = 20;
  const MOVE_SPEED = 0.1;
  const ROTATE_SPEED = 0.05;

  // ASCII characters for different depths (closer = denser)
  const DEPTH_CHARS = ['@', '#', '8', '&', 'o', ':', '.', ' '];

  // Simple maze map (1 = wall, 0 = empty)
  const DEFAULT_MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,0,0,0,0,1,1,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,1,1,0,0,0,0,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  class DoomGame {
    constructor(displayElement, dataChannel, callbacks) {
      this.displayElement = displayElement;
      this.dataChannel = dataChannel;
      this.callbacks = callbacks || {};

      // Player state
      this.playerX = 2;
      this.playerY = 2;
      this.playerAngle = 0;

      // Remote player state (for P2P)
      this.remotePlayerX = null;
      this.remotePlayerY = null;
      this.remotePlayerAngle = null;

      // Game state
      this.map = DEFAULT_MAP.map(row => [...row]);
      this.isRunning = false;
      this.animationFrameId = null;
      this.keys = {};
      this.lastUpdateTime = Date.now();
      this.lastSyncTime = 0;

      this.setupEventListeners();
      this.setupDisplay();
    }

    setupDisplay() {
      // Create ASCII display area
      this.displayElement.style.fontFamily = 'monospace';
      this.displayElement.style.fontSize = '8px';
      this.displayElement.style.lineHeight = '8px';
      this.displayElement.style.whiteSpace = 'pre';
      this.displayElement.style.backgroundColor = '#000';
      this.displayElement.style.color = '#0f0';
      this.displayElement.style.padding = '10px';
      this.displayElement.style.overflow = 'hidden';
      this.displayElement.textContent = this.renderWelcomeScreen();
    }

    renderWelcomeScreen() {
      return `
╔════════════════════════════════════════════════════════════════════════════════╗
║                                                                                ║
║   ██████╗  ██████╗  ██████╗ ███╗   ███╗     █████╗ ███████╗ ██████╗██╗██╗    ║
║   ██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║    ██╔══██╗██╔════╝██╔════╝██║██║    ║
║   ██║  ██║██║   ██║██║   ██║██╔████╔██║    ███████║███████╗██║     ██║██║    ║
║   ██║  ██║██║   ██║██║   ██║██║╚██╔╝██║    ██╔══██║╚════██║██║     ██║██║    ║
║   ██████╔╝╚██████╔╝╚██████╔╝██║ ╚═╝ ██║    ██║  ██║███████║╚██████╗██║██║    ║
║   ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝     ╚═╝    ╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝╚═╝    ║
║                                                                                ║
║                    "Doom runs everywhere" - Even in ASCII!                    ║
║                                                                                ║
║                          Press SPACE to start playing                         ║
║                                                                                ║
║  Controls:                                                                     ║
║    Arrow Keys / WASD - Move and turn                                          ║
║    ESC - Exit game                                                            ║
║                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════╝
      `.trim();
    }

    setupEventListeners() {
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleKeyUp = this.handleKeyUp.bind(this);
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);

      if (this.dataChannel) {
        this.dataChannel.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleDoomMessage(data);
          } catch (err) {
            console.error('Failed to parse Doom message:', err);
          }
        };
      }
    }

    handleKeyDown(event) {
      const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                         'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' ', 'Escape'];

      if (validKeys.includes(event.key)) {
        event.preventDefault();

        // Start game on space if not running
        if (event.key === ' ' && !this.isRunning) {
          this.start();
          return;
        }

        // Exit game on escape
        if (event.key === 'Escape' && this.isRunning) {
          this.stop();
          return;
        }

        this.keys[event.key] = true;
      }
    }

    handleKeyUp(event) {
      const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                         'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'];
      if (validKeys.includes(event.key)) {
        event.preventDefault();
        this.keys[event.key] = false;
      }
    }

    handleDoomMessage(data) {
      if (data.type === 'playerPosition') {
        this.remotePlayerX = data.x;
        this.remotePlayerY = data.y;
        this.remotePlayerAngle = data.angle;
      }
    }

    sendMessage(message) {
      if (this.dataChannel && this.dataChannel.readyState === 'open') {
        try {
          this.dataChannel.send(JSON.stringify(message));
        } catch (err) {
          console.error('Failed to send Doom message:', err);
        }
      }
    }

    start() {
      if (this.isRunning) return;

      this.isRunning = true;
      this.playerX = 2;
      this.playerY = 2;
      this.playerAngle = 0;
      this.lastUpdateTime = Date.now();
      this.lastSyncTime = 0;

      if (this.callbacks.onStart) {
        this.callbacks.onStart();
      }

      this.gameLoop();
    }

    stop() {
      this.isRunning = false;

      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      this.displayElement.textContent = this.renderWelcomeScreen();

      if (this.callbacks.onStop) {
        this.callbacks.onStop();
      }
    }

    updatePlayer(deltaTime) {
      const moveSpeed = MOVE_SPEED * deltaTime / 16;
      const rotateSpeed = ROTATE_SPEED * deltaTime / 16;

      // Rotation
      if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
        this.playerAngle -= rotateSpeed;
      }
      if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
        this.playerAngle += rotateSpeed;
      }

      // Movement
      let newX = this.playerX;
      let newY = this.playerY;

      if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
        newX += Math.cos(this.playerAngle) * moveSpeed;
        newY += Math.sin(this.playerAngle) * moveSpeed;
      }
      if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
        newX -= Math.cos(this.playerAngle) * moveSpeed;
        newY -= Math.sin(this.playerAngle) * moveSpeed;
      }

      // Collision detection
      if (!this.isWall(newX, newY)) {
        this.playerX = newX;
        this.playerY = newY;
      }

      // Sync position with remote player periodically
      const now = Date.now();
      if (now - this.lastSyncTime > 100) { // Sync every 100ms
        this.sendMessage({
          type: 'playerPosition',
          x: this.playerX,
          y: this.playerY,
          angle: this.playerAngle
        });
        this.lastSyncTime = now;
      }
    }

    isWall(x, y) {
      const mapX = Math.floor(x);
      const mapY = Math.floor(y);

      if (mapX < 0 || mapX >= MAP_WIDTH || mapY < 0 || mapY >= MAP_HEIGHT) {
        return true;
      }

      return this.map[mapY][mapX] === 1;
    }

    castRay(rayAngle) {
      const stepSize = 0.05;
      let distance = 0;

      while (distance < MAX_DEPTH) {
        distance += stepSize;

        const testX = this.playerX + Math.cos(rayAngle) * distance;
        const testY = this.playerY + Math.sin(rayAngle) * distance;

        if (this.isWall(testX, testY)) {
          return distance;
        }
      }

      return MAX_DEPTH;
    }

    render() {
      const buffer = [];

      // Render each column
      for (let x = 0; x < RENDER_WIDTH; x++) {
        const rayAngle = this.playerAngle - FOV / 2 + (x / RENDER_WIDTH) * FOV;
        const distance = this.castRay(rayAngle);

        // Calculate wall height based on distance
        const wallHeight = Math.min(RENDER_HEIGHT, Math.floor(RENDER_HEIGHT / distance));
        const wallStart = Math.floor((RENDER_HEIGHT - wallHeight) / 2);
        const wallEnd = wallStart + wallHeight;

        // Choose ASCII character based on distance
        const depthIndex = Math.min(
          DEPTH_CHARS.length - 1,
          Math.floor((distance / MAX_DEPTH) * DEPTH_CHARS.length)
        );
        const wallChar = DEPTH_CHARS[depthIndex];

        // Build column
        for (let y = 0; y < RENDER_HEIGHT; y++) {
          if (!buffer[y]) buffer[y] = [];

          if (y < wallStart) {
            buffer[y][x] = ' '; // Ceiling
          } else if (y >= wallStart && y < wallEnd) {
            buffer[y][x] = wallChar; // Wall
          } else {
            buffer[y][x] = '.'; // Floor
          }
        }
      }

      // Add HUD
      const hudLine = ` POS: (${this.playerX.toFixed(1)}, ${this.playerY.toFixed(1)}) | ANGLE: ${(this.playerAngle * 180 / Math.PI).toFixed(0)}° | ESC to exit `;
      buffer[0] = hudLine.padEnd(RENDER_WIDTH).substring(0, RENDER_WIDTH).split('');

      // Convert buffer to string
      this.displayElement.textContent = buffer.map(row => row.join('')).join('\n');
    }

    gameLoop() {
      if (!this.isRunning) return;

      const now = Date.now();
      const deltaTime = now - this.lastUpdateTime;
      this.lastUpdateTime = now;

      this.updatePlayer(deltaTime);
      this.render();

      this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    destroy() {
      this.stop();
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);

      if (this.dataChannel) {
        this.dataChannel.onmessage = null;
      }
    }
  }

  // Export to global scope
  window.DoomGame = DoomGame;

})(window);
