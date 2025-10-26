/**
 * Standalone Pong Game Component
 * Integrated P2P Pong game for TheCommunity chat app
 */
(function (window) {
  'use strict';

  // Base dimensions for aspect ratio calculation (4:3 ratio)
  const BASE_WIDTH = 800;
  const BASE_HEIGHT = 600;
  const PADDLE_WIDTH_RATIO = 15 / 800;  // Relative to canvas width
  const PADDLE_HEIGHT_RATIO = 100 / 600; // Relative to canvas height
  const BALL_RADIUS_RATIO = 10 / 800;    // Relative to canvas width
  const PADDLE_SPEED = 8;
  const BALL_SPEED_INITIAL = 5;
  const BALL_SPEED_INCREMENT = 0.3;
  const MAX_LIVES = 3;

  class PongGame {
    constructor(canvas, dataChannel, callbacks) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.dataChannel = dataChannel;
      this.callbacks = callbacks || {};

      this.gameState = null;
      this.animationFrameId = null;
      this.isHost = false;
      this.lastUpdateTime = Date.now();
      this.keys = {};

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
      // Use devicePixelRatio for high-DPI displays
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = displayWidth * dpr;
      this.canvas.height = displayHeight * dpr;

      // Scale context to match device pixel ratio
      this.ctx.scale(dpr, dpr);

      // Store logical dimensions for game calculations
      this.canvasWidth = displayWidth;
      this.canvasHeight = displayHeight;

      // Calculate scaled game element sizes
      this.paddleWidth = this.canvasWidth * PADDLE_WIDTH_RATIO;
      this.paddleHeight = this.canvasHeight * PADDLE_HEIGHT_RATIO;
      this.ballRadius = this.canvasWidth * BALL_RADIUS_RATIO;
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
            this.handlePongMessage(data);
          } catch (err) {
            console.error('Failed to parse Pong message:', err);
          }
        };
      }
    }

    handleKeyDown(event) {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        this.keys[event.key] = true;
      }
    }

    handleKeyUp(event) {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        this.keys[event.key] = false;
      }
    }

    sendMessage(message) {
      if (this.dataChannel && this.dataChannel.readyState === 'open') {
        try {
          this.dataChannel.send(JSON.stringify(message));
        } catch (err) {
          console.error('Failed to send Pong message:', err);
        }
      }
    }

    handlePongMessage(data) {
      if (!this.gameState) return;

      switch (data.type) {
        case 'start-game':
          this.startGame(false);
          this.sendMessage({ type: 'game-started' });
          if (this.callbacks.onGameStarted) {
            this.callbacks.onGameStarted();
          }
          break;

        case 'game-started':
          if (this.callbacks.onGameStarted) {
            this.callbacks.onGameStarted();
          }
          break;

        case 'paddle-move':
          if (this.isHost) {
            this.gameState.rightPaddle.y = data.y;
          } else {
            this.gameState.leftPaddle.y = data.y;
          }
          break;

        case 'ball-sync':
          if (!this.isHost && this.gameState) {
            this.gameState.ball = data.ball;
            this.gameState.score = data.score;
            this.gameState.lives = data.lives;
            this.updateScoreDisplay();
          }
          break;

        case 'game-over':
          this.handleGameOver(data.winner);
          break;

        default:
          console.warn('Unknown Pong message type:', data.type);
      }
    }

    initializeGameState(asHost) {
      this.isHost = asHost;
      this.gameState = {
        ball: {
          x: this.canvasWidth / 2,
          y: this.canvasHeight / 2,
          vx: (asHost ? 1 : -1) * BALL_SPEED_INITIAL,
          vy: (Math.random() - 0.5) * BALL_SPEED_INITIAL
        },
        leftPaddle: {
          y: this.canvasHeight / 2 - this.paddleHeight / 2
        },
        rightPaddle: {
          y: this.canvasHeight / 2 - this.paddleHeight / 2
        },
        score: {
          left: 0,
          right: 0
        },
        lives: {
          left: MAX_LIVES,
          right: MAX_LIVES
        },
        gameOver: false,
        winner: null
      };
    }

    startGame(asHost) {
      if (this.gameState) {
        this.stopGame();
      }

      this.initializeGameState(asHost);

      if (asHost) {
        this.sendMessage({ type: 'start-game' });
        if (this.callbacks.onChallengeSent) {
          this.callbacks.onChallengeSent();
        }
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
      this.keys = {};
    }

    gameLoop() {
      if (!this.gameState || this.gameState.gameOver) return;

      const now = Date.now();
      const deltaTime = (now - this.lastUpdateTime) / 16.67;
      this.lastUpdateTime = now;

      this.updatePaddles(deltaTime);

      if (this.isHost) {
        this.updateBall(deltaTime);
      }

      this.render();

      if (this.isHost) {
        this.sendMessage({
          type: 'ball-sync',
          ball: this.gameState.ball,
          score: this.gameState.score,
          lives: this.gameState.lives
        });
      }

      this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    updatePaddles(deltaTime) {
      if (!this.gameState) return;

      const paddle = this.isHost ? this.gameState.leftPaddle : this.gameState.rightPaddle;
      let moved = false;

      if (this.keys['ArrowUp']) {
        paddle.y -= PADDLE_SPEED * deltaTime;
        moved = true;
      }
      if (this.keys['ArrowDown']) {
        paddle.y += PADDLE_SPEED * deltaTime;
        moved = true;
      }

      paddle.y = Math.max(0, Math.min(this.canvasHeight - this.paddleHeight, paddle.y));

      if (moved) {
        this.sendMessage({
          type: 'paddle-move',
          y: paddle.y
        });
      }
    }

    updateBall(deltaTime) {
      if (!this.gameState) return;

      const { ball, leftPaddle, rightPaddle } = this.gameState;

      ball.x += ball.vx * deltaTime;
      ball.y += ball.vy * deltaTime;

      if (ball.y - this.ballRadius <= 0 || ball.y + this.ballRadius >= this.canvasHeight) {
        ball.vy = -ball.vy;
        ball.y = Math.max(this.ballRadius, Math.min(this.canvasHeight - this.ballRadius, ball.y));
      }

      if (
        ball.x - this.ballRadius <= this.paddleWidth &&
        ball.y >= leftPaddle.y &&
        ball.y <= leftPaddle.y + this.paddleHeight &&
        ball.vx < 0
      ) {
        ball.vx = -ball.vx * (1 + BALL_SPEED_INCREMENT / 10);
        ball.x = this.paddleWidth + this.ballRadius;
        const hitPos = (ball.y - leftPaddle.y) / this.paddleHeight;
        ball.vy += (hitPos - 0.5) * 2;
      }

      if (
        ball.x + this.ballRadius >= this.canvasWidth - this.paddleWidth &&
        ball.y >= rightPaddle.y &&
        ball.y <= rightPaddle.y + this.paddleHeight &&
        ball.vx > 0
      ) {
        ball.vx = -ball.vx * (1 + BALL_SPEED_INCREMENT / 10);
        ball.x = this.canvasWidth - this.paddleWidth - this.ballRadius;
        const hitPos = (ball.y - rightPaddle.y) / this.paddleHeight;
        ball.vy += (hitPos - 0.5) * 2;
      }

      if (ball.x - this.ballRadius <= 0) {
        this.handlePoint('right');
      }

      if (ball.x + this.ballRadius >= this.canvasWidth) {
        this.handlePoint('left');
      }
    }

    handlePoint(scorer) {
      if (!this.gameState) return;

      this.gameState.score[scorer]++;

      const loser = scorer === 'left' ? 'right' : 'left';
      this.gameState.lives[loser]--;

      this.updateScoreDisplay();

      if (this.gameState.lives[loser] <= 0) {
        this.gameState.gameOver = true;
        this.gameState.winner = scorer;
        this.sendMessage({ type: 'game-over', winner: scorer });
        this.handleGameOver(scorer);
        return;
      }

      this.resetBall();
    }

    resetBall() {
      if (!this.gameState) return;

      this.gameState.ball.x = this.canvasWidth / 2;
      this.gameState.ball.y = this.canvasHeight / 2;
      this.gameState.ball.vx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED_INITIAL;
      this.gameState.ball.vy = (Math.random() - 0.5) * BALL_SPEED_INITIAL;
    }

    updateScoreDisplay() {
      if (!this.gameState) return;

      if (this.callbacks.onScoreUpdate) {
        this.callbacks.onScoreUpdate(this.gameState.score, this.gameState.lives);
      }
    }

    handleGameOver(winner) {
      if (!this.gameState) return;

      this.gameState.gameOver = true;
      this.gameState.winner = winner;

      const iWon = (this.isHost && winner === 'left') || (!this.isHost && winner === 'right');

      if (this.callbacks.onGameOver) {
        this.callbacks.onGameOver(iWon);
      }

      this.stopGame();
    }

    render() {
      if (!this.canvas || !this.gameState) return;

      const ctx = this.ctx;

      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(this.canvasWidth / 2, 0);
      ctx.lineTo(this.canvasWidth / 2, this.canvasHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, this.gameState.leftPaddle.y, this.paddleWidth, this.paddleHeight);
      ctx.fillRect(this.canvasWidth - this.paddleWidth, this.gameState.rightPaddle.y, this.paddleWidth, this.paddleHeight);

      ctx.beginPath();
      ctx.arc(this.gameState.ball.x, this.gameState.ball.y, this.ballRadius, 0, Math.PI * 2);
      ctx.fill();

      // Scale font sizes based on canvas dimensions
      const scoreFontSize = Math.max(24, this.canvasHeight * 0.08);
      const livesFontSize = Math.max(12, this.canvasHeight * 0.033);

      ctx.font = `${scoreFontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(this.gameState.score.left.toString(), this.canvasWidth / 4, scoreFontSize + 12);
      ctx.fillText(this.gameState.score.right.toString(), (3 * this.canvasWidth) / 4, scoreFontSize + 12);

      ctx.font = `${livesFontSize}px monospace`;
      const leftLives = '❤️'.repeat(this.gameState.lives.left);
      const rightLives = '❤️'.repeat(this.gameState.lives.right);
      ctx.fillText(leftLives, this.canvasWidth / 4, scoreFontSize + 52);
      ctx.fillText(rightLives, (3 * this.canvasWidth) / 4, scoreFontSize + 52);
    }

    destroy() {
      this.stopGame();
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    }
  }

  window.PongGame = PongGame;
})(window);
