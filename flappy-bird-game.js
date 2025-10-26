/**
 * Standalone Flappy Bird Game Component
 * Integrated Flappy Bird game for TheCommunity chat app
 */
(function (window) {
  'use strict';

  // Base dimensions for aspect ratio calculation
  const BASE_WIDTH = 800;
  const BASE_HEIGHT = 600;
  const BIRD_SIZE_RATIO = 34 / 800;  // Relative to canvas width
  const PIPE_WIDTH_RATIO = 80 / 800;
  const PIPE_GAP_RATIO = 180 / 600;  // Relative to canvas height
  const GRAVITY = 0.5;
  const FLAP_STRENGTH = -9;
  const BIRD_X_POSITION_RATIO = 0.2; // Bird positioned at 20% from left
  const PIPE_SPEED = 3;
  const PIPE_SPACING = 300;
  const GROUND_HEIGHT_RATIO = 100 / 600;

  class FlappyBirdGame {
    constructor(canvas, dataChannel, callbacks) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.dataChannel = dataChannel;
      this.callbacks = callbacks || {};

      this.gameState = null;
      this.animationFrameId = null;
      this.lastUpdateTime = Date.now();
      this.highScore = this.loadHighScore();

      // Set up responsive canvas dimensions
      this.updateCanvasDimensions();
      this.setupEventListeners();

      // Add resize observer for dynamic resizing
      this.resizeObserver = new ResizeObserver(() => {
        this.updateCanvasDimensions();
      });
      this.resizeObserver.observe(this.canvas);
    }

    updateCanvasDimensions() {
      // Get the displayed size of canvas from CSS
      const rect = this.canvas.getBoundingClientRect();
      const displayWidth = rect.width;
      const displayHeight = rect.height;

      // Set internal canvas resolution to match display size for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = displayWidth * dpr;
      this.canvas.height = displayHeight * dpr;

      // Scale context to match device pixel ratio
      this.ctx.scale(dpr, dpr);

      // Store logical dimensions for game calculations
      this.canvasWidth = displayWidth;
      this.canvasHeight = displayHeight;

      // Calculate scaled game element sizes
      this.birdSize = this.canvasWidth * BIRD_SIZE_RATIO;
      this.pipeWidth = this.canvasWidth * PIPE_WIDTH_RATIO;
      this.pipeGap = this.canvasHeight * PIPE_GAP_RATIO;
      this.groundHeight = this.canvasHeight * GROUND_HEIGHT_RATIO;
      this.birdX = this.canvasWidth * BIRD_X_POSITION_RATIO;
    }

    setupEventListeners() {
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleTouch = this.handleTouch.bind(this);

      window.addEventListener('keydown', this.handleKeyDown);
      this.canvas.addEventListener('click', this.handleClick);
      this.canvas.addEventListener('touchstart', this.handleTouch);

      if (this.dataChannel) {
        this.dataChannel.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleFlappyMessage(data);
          } catch (err) {
            console.error('Failed to parse Flappy Bird message:', err);
          }
        };
      }
    }

    handleKeyDown(event) {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        this.flap();
      }
    }

    handleClick(event) {
      event.preventDefault();
      this.flap();
    }

    handleTouch(event) {
      event.preventDefault();
      this.flap();
    }

    flap() {
      if (!this.gameState) return;

      if (this.gameState.gameOver) {
        // Restart game on flap after game over
        this.startGame();
        return;
      }

      if (!this.gameState.started) {
        this.gameState.started = true;
      }

      this.gameState.bird.velocity = FLAP_STRENGTH;
    }

    sendMessage(message) {
      if (this.dataChannel && this.dataChannel.readyState === 'open') {
        try {
          this.dataChannel.send(JSON.stringify(message));
        } catch (err) {
          console.error('Failed to send Flappy Bird message:', err);
        }
      }
    }

    handleFlappyMessage(data) {
      switch (data.type) {
        case 'challenge':
          if (this.callbacks.onChallengeReceived) {
            this.callbacks.onChallengeReceived(data.score);
          }
          break;

        case 'high-score':
          if (this.callbacks.onHighScoreReceived) {
            this.callbacks.onHighScoreReceived(data.score);
          }
          break;

        default:
          console.warn('Unknown Flappy Bird message type:', data.type);
      }
    }

    loadHighScore() {
      try {
        const stored = localStorage.getItem('flappybird.highscore');
        return stored ? parseInt(stored, 10) : 0;
      } catch (err) {
        return 0;
      }
    }

    saveHighScore(score) {
      try {
        localStorage.setItem('flappybird.highscore', score.toString());
      } catch (err) {
        console.warn('Could not save high score:', err);
      }
    }

    initializeGameState() {
      this.gameState = {
        bird: {
          y: this.canvasHeight / 2,
          velocity: 0,
          rotation: 0
        },
        pipes: [],
        score: 0,
        gameOver: false,
        started: false,
        nextPipeDistance: PIPE_SPACING
      };

      // Create initial pipes
      this.addPipe();
    }

    addPipe() {
      if (!this.gameState) return;

      const minPipeHeight = 50;
      const maxPipeHeight = this.canvasHeight - this.groundHeight - this.pipeGap - 50;
      const topPipeHeight = minPipeHeight + Math.random() * (maxPipeHeight - minPipeHeight);

      this.gameState.pipes.push({
        x: this.canvasWidth,
        topHeight: topPipeHeight,
        bottomY: topPipeHeight + this.pipeGap,
        scored: false
      });
    }

    startGame() {
      if (this.gameState && !this.gameState.gameOver) {
        this.stopGame();
      }

      this.initializeGameState();

      if (this.callbacks.onGameStarted) {
        this.callbacks.onGameStarted();
      }

      this.lastUpdateTime = Date.now();
      this.gameLoop();
    }

    stopGame() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.gameState = null;
    }

    gameLoop() {
      if (!this.gameState) return;

      const now = Date.now();
      const deltaTime = Math.min((now - this.lastUpdateTime) / 16.67, 2); // Cap at 2 frames
      this.lastUpdateTime = now;

      if (this.gameState.started && !this.gameState.gameOver) {
        this.update(deltaTime);
      }

      this.render();

      this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    update(deltaTime) {
      if (!this.gameState || this.gameState.gameOver) return;

      // Update bird physics
      this.gameState.bird.velocity += GRAVITY * deltaTime;
      this.gameState.bird.y += this.gameState.bird.velocity * deltaTime;

      // Update bird rotation based on velocity
      this.gameState.bird.rotation = Math.min(Math.max(this.gameState.bird.velocity * 2, -30), 90);

      // Check ground collision
      if (this.gameState.bird.y + this.birdSize / 2 >= this.canvasHeight - this.groundHeight) {
        this.handleGameOver();
        return;
      }

      // Check ceiling collision
      if (this.gameState.bird.y - this.birdSize / 2 <= 0) {
        this.gameState.bird.y = this.birdSize / 2;
        this.gameState.bird.velocity = 0;
      }

      // Update pipes
      for (let i = this.gameState.pipes.length - 1; i >= 0; i--) {
        const pipe = this.gameState.pipes[i];
        pipe.x -= PIPE_SPEED * deltaTime;

        // Check collision
        if (this.checkCollision(pipe)) {
          this.handleGameOver();
          return;
        }

        // Check scoring
        if (!pipe.scored && pipe.x + this.pipeWidth < this.birdX) {
          pipe.scored = true;
          this.gameState.score++;

          if (this.callbacks.onScoreUpdate) {
            this.callbacks.onScoreUpdate(this.gameState.score);
          }
        }

        // Remove off-screen pipes
        if (pipe.x + this.pipeWidth < 0) {
          this.gameState.pipes.splice(i, 1);
        }
      }

      // Add new pipes
      this.gameState.nextPipeDistance -= PIPE_SPEED * deltaTime;
      if (this.gameState.nextPipeDistance <= 0) {
        this.addPipe();
        this.gameState.nextPipeDistance = PIPE_SPACING;
      }
    }

    checkCollision(pipe) {
      if (!this.gameState) return false;

      const birdLeft = this.birdX - this.birdSize / 2;
      const birdRight = this.birdX + this.birdSize / 2;
      const birdTop = this.gameState.bird.y - this.birdSize / 2;
      const birdBottom = this.gameState.bird.y + this.birdSize / 2;

      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + this.pipeWidth;

      // Check if bird is in horizontal range of pipe
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check collision with top pipe or bottom pipe
        if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
          return true;
        }
      }

      return false;
    }

    handleGameOver() {
      if (!this.gameState) return;

      this.gameState.gameOver = true;

      // Update high score
      if (this.gameState.score > this.highScore) {
        this.highScore = this.gameState.score;
        this.saveHighScore(this.highScore);

        // Share high score with peer
        this.sendMessage({
          type: 'high-score',
          score: this.highScore
        });
      }

      if (this.callbacks.onGameOver) {
        this.callbacks.onGameOver(this.gameState.score, this.highScore);
      }
    }

    sendChallenge() {
      if (this.gameState) {
        this.sendMessage({
          type: 'challenge',
          score: this.gameState.score
        });
      }
    }

    render() {
      if (!this.canvas || !this.gameState) return;

      const ctx = this.ctx;

      // Clear and draw sky background
      const gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
      gradient.addColorStop(0, '#4EC0CA');
      gradient.addColorStop(1, '#87CEEB');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      // Draw pipes
      ctx.fillStyle = '#5CB85C';
      ctx.strokeStyle = '#4A934A';
      ctx.lineWidth = 3;

      for (const pipe of this.gameState.pipes) {
        // Top pipe
        ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
        ctx.strokeRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);

        // Pipe cap (top)
        const capHeight = 30;
        const capExtension = 5;
        ctx.fillRect(pipe.x - capExtension, pipe.topHeight - capHeight, this.pipeWidth + capExtension * 2, capHeight);
        ctx.strokeRect(pipe.x - capExtension, pipe.topHeight - capHeight, this.pipeWidth + capExtension * 2, capHeight);

        // Bottom pipe
        const bottomPipeHeight = this.canvasHeight - this.groundHeight - pipe.bottomY;
        ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, bottomPipeHeight);
        ctx.strokeRect(pipe.x, pipe.bottomY, this.pipeWidth, bottomPipeHeight);

        // Pipe cap (bottom)
        ctx.fillRect(pipe.x - capExtension, pipe.bottomY, this.pipeWidth + capExtension * 2, capHeight);
        ctx.strokeRect(pipe.x - capExtension, pipe.bottomY, this.pipeWidth + capExtension * 2, capHeight);
      }

      // Draw ground
      ctx.fillStyle = '#DEB887';
      ctx.fillRect(0, this.canvasHeight - this.groundHeight, this.canvasWidth, this.groundHeight);
      ctx.strokeStyle = '#8B7355';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, this.canvasHeight - this.groundHeight);
      ctx.lineTo(this.canvasWidth, this.canvasHeight - this.groundHeight);
      ctx.stroke();

      // Draw bird
      ctx.save();
      ctx.translate(this.birdX, this.gameState.bird.y);
      ctx.rotate((this.gameState.bird.rotation * Math.PI) / 180);

      // Bird body
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(0, 0, this.birdSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bird eye
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(this.birdSize / 6, -this.birdSize / 6, this.birdSize / 10, 0, Math.PI * 2);
      ctx.fill();

      // Bird beak
      ctx.fillStyle = '#FF6347';
      ctx.beginPath();
      ctx.moveTo(this.birdSize / 2, 0);
      ctx.lineTo(this.birdSize / 2 + 10, -3);
      ctx.lineTo(this.birdSize / 2 + 10, 3);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Draw score
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.font = `bold ${Math.max(36, this.canvasHeight * 0.06)}px Arial`;
      ctx.textAlign = 'center';
      ctx.strokeText(this.gameState.score.toString(), this.canvasWidth / 2, 60);
      ctx.fillText(this.gameState.score.toString(), this.canvasWidth / 2, 60);

      // Draw high score
      ctx.font = `${Math.max(16, this.canvasHeight * 0.027)}px Arial`;
      ctx.strokeText(`High Score: ${this.highScore}`, this.canvasWidth / 2, 90);
      ctx.fillText(`High Score: ${this.highScore}`, this.canvasWidth / 2, 90);

      // Draw instructions or game over message
      if (!this.gameState.started) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, this.canvasHeight / 2 - 60, this.canvasWidth, 120);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.max(24, this.canvasHeight * 0.04)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE or Click to Start', this.canvasWidth / 2, this.canvasHeight / 2);
        ctx.font = `${Math.max(16, this.canvasHeight * 0.027)}px Arial`;
        ctx.fillText('Keep pressing to flap!', this.canvasWidth / 2, this.canvasHeight / 2 + 30);
      }

      if (this.gameState.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, this.canvasHeight / 2 - 80, this.canvasWidth, 160);

        ctx.fillStyle = '#FF6347';
        ctx.font = `bold ${Math.max(32, this.canvasHeight * 0.053)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', this.canvasWidth / 2, this.canvasHeight / 2 - 20);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${Math.max(20, this.canvasHeight * 0.033)}px Arial`;
        ctx.fillText(`Score: ${this.gameState.score}`, this.canvasWidth / 2, this.canvasHeight / 2 + 20);

        if (this.gameState.score === this.highScore && this.gameState.score > 0) {
          ctx.fillStyle = '#FFD700';
          ctx.fillText('New High Score!', this.canvasWidth / 2, this.canvasHeight / 2 + 50);
        }

        ctx.fillStyle = '#AAAAAA';
        ctx.font = `${Math.max(16, this.canvasHeight * 0.027)}px Arial`;
        ctx.fillText('Press SPACE or Click to Restart', this.canvasWidth / 2, this.canvasHeight / 2 + 75);
      }
    }

    destroy() {
      this.stopGame();
      window.removeEventListener('keydown', this.handleKeyDown);
      this.canvas.removeEventListener('click', this.handleClick);
      this.canvas.removeEventListener('touchstart', this.handleTouch);
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    }

    getHighScore() {
      return this.highScore;
    }

    getCurrentScore() {
      return this.gameState ? this.gameState.score : 0;
    }

    isGameActive() {
      return this.gameState !== null && !this.gameState.gameOver;
    }
  }

  window.FlappyBirdGame = FlappyBirdGame;
})(window);
