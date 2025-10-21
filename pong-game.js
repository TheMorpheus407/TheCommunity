/**
 * Standalone Pong Game Component
 * Integrated P2P Pong game for TheCommunity chat app
 */
(function (window) {
  'use strict';

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PADDLE_WIDTH = 15;
  const PADDLE_HEIGHT = 100;
  const BALL_RADIUS = 10;
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

      this.setupEventListeners();
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
          x: CANVAS_WIDTH / 2,
          y: CANVAS_HEIGHT / 2,
          vx: (asHost ? 1 : -1) * BALL_SPEED_INITIAL,
          vy: (Math.random() - 0.5) * BALL_SPEED_INITIAL
        },
        leftPaddle: {
          y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2
        },
        rightPaddle: {
          y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2
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

      paddle.y = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, paddle.y));

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

      if (ball.y - BALL_RADIUS <= 0 || ball.y + BALL_RADIUS >= CANVAS_HEIGHT) {
        ball.vy = -ball.vy;
        ball.y = Math.max(BALL_RADIUS, Math.min(CANVAS_HEIGHT - BALL_RADIUS, ball.y));
      }

      if (
        ball.x - BALL_RADIUS <= PADDLE_WIDTH &&
        ball.y >= leftPaddle.y &&
        ball.y <= leftPaddle.y + PADDLE_HEIGHT &&
        ball.vx < 0
      ) {
        ball.vx = -ball.vx * (1 + BALL_SPEED_INCREMENT / 10);
        ball.x = PADDLE_WIDTH + BALL_RADIUS;
        const hitPos = (ball.y - leftPaddle.y) / PADDLE_HEIGHT;
        ball.vy += (hitPos - 0.5) * 2;
      }

      if (
        ball.x + BALL_RADIUS >= CANVAS_WIDTH - PADDLE_WIDTH &&
        ball.y >= rightPaddle.y &&
        ball.y <= rightPaddle.y + PADDLE_HEIGHT &&
        ball.vx > 0
      ) {
        ball.vx = -ball.vx * (1 + BALL_SPEED_INCREMENT / 10);
        ball.x = CANVAS_WIDTH - PADDLE_WIDTH - BALL_RADIUS;
        const hitPos = (ball.y - rightPaddle.y) / PADDLE_HEIGHT;
        ball.vy += (hitPos - 0.5) * 2;
      }

      if (ball.x - BALL_RADIUS <= 0) {
        this.handlePoint('right');
      }

      if (ball.x + BALL_RADIUS >= CANVAS_WIDTH) {
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

      this.gameState.ball.x = CANVAS_WIDTH / 2;
      this.gameState.ball.y = CANVAS_HEIGHT / 2;
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
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, this.gameState.leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, this.gameState.rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

      ctx.beginPath();
      ctx.arc(this.gameState.ball.x, this.gameState.ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '48px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.gameState.score.left.toString(), CANVAS_WIDTH / 4, 60);
      ctx.fillText(this.gameState.score.right.toString(), (3 * CANVAS_WIDTH) / 4, 60);

      ctx.font = '20px monospace';
      const leftLives = '❤️'.repeat(this.gameState.lives.left);
      const rightLives = '❤️'.repeat(this.gameState.lives.right);
      ctx.fillText(leftLives, CANVAS_WIDTH / 4, 100);
      ctx.fillText(rightLives, (3 * CANVAS_WIDTH) / 4, 100);
    }

    destroy() {
      this.stopGame();
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
    }
  }

  window.PongGame = PongGame;
})(window);
