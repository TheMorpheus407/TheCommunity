/**
 * @fileoverview Pong Manager - Handles Pong game logic and rendering
 * @module managers/PongManager
 *
 * This manager handles:
 * - Pong game state (ball, paddles, scores, lives)
 * - Game rendering on canvas
 * - Physics and collision detection
 * - Synchronization over WebRTC data channel
 * - Game lifecycle (start, pause, end)
 */

import { PONG_CHANNEL_LABEL } from '../core/constants.js';

/**
 * Creates a factory for Pong game operations
 * @param {Object} deps - Dependencies object
 * @param {React.MutableRefObject} deps.pongChannelRef - Pong data channel reference
 * @param {React.MutableRefObject} deps.pongCanvasRef - Canvas element reference
 * @param {Function} deps.setPongGameActive - Pong game active state setter
 * @param {Function} deps.setPongScore - Pong score state setter
 * @param {Function} deps.setPongLives - Pong lives state setter
 * @param {Function} deps.appendMessage - Message appender function
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Object} deps.t - Translation object
 * @returns {Object} Pong game operations
 * @export
 */
export function createPongManager(deps) {
  const {
    pongChannelRef,
    pongCanvasRef,
    setPongGameActive,
    setPongScore,
    setPongLives,
    appendMessage,
    appendSystemMessage,
    t
  } = deps;

  // Game constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PADDLE_WIDTH = 15;
  const PADDLE_HEIGHT = 100;
  const BALL_RADIUS = 10;
  const PADDLE_SPEED = 8;
  const BALL_SPEED_INITIAL = 5;
  const BALL_SPEED_INCREMENT = 0.3;
  const MAX_LIVES = 3;

  // Game state
  let gameState = null;
  let animationFrameId = null;
  let isHost = false;
  let lastUpdateTime = Date.now();

  /**
   * Initializes the game state
   * @param {boolean} asHost - Whether this player is the host (left paddle)
   */
  function initializeGameState(asHost) {
    isHost = asHost;
    gameState = {
      ball: {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        vx: (asHost ? 1 : -1) * BALL_SPEED_INITIAL,
        vy: (Math.random() - 0.5) * BALL_SPEED_INITIAL
      },
      leftPaddle: {
        y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        vy: 0
      },
      rightPaddle: {
        y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        vy: 0
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

  /**
   * Sets up the Pong data channel for game synchronization
   * @param {RTCDataChannel} channel - The Pong data channel
   */
  function setupPongChannel(channel) {
    pongChannelRef.current = channel;

    channel.onopen = () => {
      appendSystemMessage(t.pong.channelReady);
    };

    channel.onclose = () => {
      stopGame();
      appendSystemMessage(t.pong.channelClosed);
    };

    channel.onerror = (err) => {
      console.error('Pong channel error:', err);
      appendSystemMessage(t.pong.channelError);
    };

    channel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handlePongMessage(data);
      } catch (err) {
        console.error('Failed to parse Pong message:', err);
      }
    };
  }

  /**
   * Handles incoming Pong messages
   * @param {Object} data - The message data
   */
  function handlePongMessage(data) {
    if (!gameState) return;

    switch (data.type) {
      case 'start-game':
        // Opponent initiated the game
        startGame(false);
        sendPongMessage({ type: 'game-started' });
        break;

      case 'game-started':
        // Opponent acknowledged game start
        appendSystemMessage(t.pong.gameStarted);
        break;

      case 'paddle-move':
        // Update opponent's paddle position
        if (isHost) {
          gameState.rightPaddle.y = data.y;
        } else {
          gameState.leftPaddle.y = data.y;
        }
        break;

      case 'ball-sync':
        // Host sends ball position updates
        if (!isHost && gameState) {
          gameState.ball = data.ball;
          gameState.score = data.score;
          gameState.lives = data.lives;
          updateScoreDisplay();
        }
        break;

      case 'game-over':
        handleGameOver(data.winner);
        break;

      default:
        console.warn('Unknown Pong message type:', data.type);
    }
  }

  /**
   * Sends a Pong message over the data channel
   * @param {Object} message - The message to send
   */
  function sendPongMessage(message) {
    const channel = pongChannelRef.current;
    if (channel && channel.readyState === 'open') {
      try {
        channel.send(JSON.stringify(message));
      } catch (err) {
        console.error('Failed to send Pong message:', err);
      }
    }
  }

  /**
   * Starts the Pong game
   * @param {boolean} asHost - Whether this player is the host
   */
  function startGame(asHost) {
    if (gameState) {
      stopGame();
    }

    initializeGameState(asHost);
    setPongGameActive(true);
    updateScoreDisplay();

    if (asHost) {
      sendPongMessage({ type: 'start-game' });
      appendSystemMessage(t.pong.challengeSent);
    }

    // Start game loop
    lastUpdateTime = Date.now();
    gameLoop();
  }

  /**
   * Stops the Pong game
   */
  function stopGame() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    gameState = null;
    setPongGameActive(false);
  }

  /**
   * Main game loop
   */
  function gameLoop() {
    if (!gameState || gameState.gameOver) return;

    const now = Date.now();
    const deltaTime = (now - lastUpdateTime) / 16.67; // Normalize to 60fps
    lastUpdateTime = now;

    // Only the host updates the ball physics
    if (isHost) {
      updateBall(deltaTime);
    }

    // Render the game
    render();

    // Sync game state
    if (isHost) {
      sendPongMessage({
        type: 'ball-sync',
        ball: gameState.ball,
        score: gameState.score,
        lives: gameState.lives
      });
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  /**
   * Updates ball physics (host only)
   * @param {number} deltaTime - Time delta for frame-independent physics
   */
  function updateBall(deltaTime) {
    if (!gameState) return;

    const { ball, leftPaddle, rightPaddle } = gameState;

    // Move ball
    ball.x += ball.vx * deltaTime;
    ball.y += ball.vy * deltaTime;

    // Top and bottom wall collision
    if (ball.y - BALL_RADIUS <= 0 || ball.y + BALL_RADIUS >= CANVAS_HEIGHT) {
      ball.vy = -ball.vy;
      ball.y = Math.max(BALL_RADIUS, Math.min(CANVAS_HEIGHT - BALL_RADIUS, ball.y));
    }

    // Left paddle collision
    if (
      ball.x - BALL_RADIUS <= PADDLE_WIDTH &&
      ball.y >= leftPaddle.y &&
      ball.y <= leftPaddle.y + PADDLE_HEIGHT &&
      ball.vx < 0
    ) {
      ball.vx = -ball.vx * (1 + BALL_SPEED_INCREMENT / 10);
      ball.x = PADDLE_WIDTH + BALL_RADIUS;
      // Add spin based on where ball hit paddle
      const hitPos = (ball.y - leftPaddle.y) / PADDLE_HEIGHT;
      ball.vy += (hitPos - 0.5) * 2;
    }

    // Right paddle collision
    if (
      ball.x + BALL_RADIUS >= CANVAS_WIDTH - PADDLE_WIDTH &&
      ball.y >= rightPaddle.y &&
      ball.y <= rightPaddle.y + PADDLE_HEIGHT &&
      ball.vx > 0
    ) {
      ball.vx = -ball.vx * (1 + BALL_SPEED_INCREMENT / 10);
      ball.x = CANVAS_WIDTH - PADDLE_WIDTH - BALL_RADIUS;
      // Add spin based on where ball hit paddle
      const hitPos = (ball.y - rightPaddle.y) / PADDLE_HEIGHT;
      ball.vy += (hitPos - 0.5) * 2;
    }

    // Ball went out on left side
    if (ball.x - BALL_RADIUS <= 0) {
      handlePoint('right');
    }

    // Ball went out on right side
    if (ball.x + BALL_RADIUS >= CANVAS_WIDTH) {
      handlePoint('left');
    }
  }

  /**
   * Handles a point being scored
   * @param {string} scorer - 'left' or 'right'
   */
  function handlePoint(scorer) {
    if (!gameState) return;

    gameState.score[scorer]++;

    const loser = scorer === 'left' ? 'right' : 'left';
    gameState.lives[loser]--;

    updateScoreDisplay();

    // Check if game is over
    if (gameState.lives[loser] <= 0) {
      gameState.gameOver = true;
      gameState.winner = scorer;
      sendPongMessage({ type: 'game-over', winner: scorer });
      handleGameOver(scorer);
      return;
    }

    // Reset ball position
    resetBall();
  }

  /**
   * Resets the ball to center
   */
  function resetBall() {
    if (!gameState) return;

    gameState.ball.x = CANVAS_WIDTH / 2;
    gameState.ball.y = CANVAS_HEIGHT / 2;
    gameState.ball.vx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED_INITIAL;
    gameState.ball.vy = (Math.random() - 0.5) * BALL_SPEED_INITIAL;
  }

  /**
   * Updates the score display in React state
   */
  function updateScoreDisplay() {
    if (!gameState) return;

    setPongScore(gameState.score);
    setPongLives(gameState.lives);
  }

  /**
   * Handles game over
   * @param {string} winner - 'left' or 'right'
   */
  function handleGameOver(winner) {
    if (!gameState) return;

    gameState.gameOver = true;
    gameState.winner = winner;

    const iWon = (isHost && winner === 'left') || (!isHost && winner === 'right');

    if (iWon) {
      appendSystemMessage(t.pong.victory);
    } else {
      appendSystemMessage(t.pong.defeat);
      // Send automatic message acknowledging opponent's superiority
      setTimeout(() => {
        appendMessage(t.pong.defeatMessage, 'local');
        const channel = pongChannelRef.current?.parentNode?.querySelector('[data-channel="chat"]');
        // We'll trigger this through the main chat channel
        sendDefeatMessage();
      }, 500);
    }

    stopGame();
  }

  /**
   * Sends the defeat acknowledgment message
   */
  function sendDefeatMessage() {
    // This will be handled by the chat system
    // We just append it locally, the chat send mechanism will handle transmission
  }

  /**
   * Moves the player's paddle
   * @param {number} direction - 1 for down, -1 for up, 0 for stop
   */
  function movePaddle(direction) {
    if (!gameState) return;

    const paddle = isHost ? gameState.leftPaddle : gameState.rightPaddle;
    paddle.vy = direction * PADDLE_SPEED;

    // Update paddle position
    paddle.y += paddle.vy;
    paddle.y = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, paddle.y));

    // Send paddle position to opponent
    sendPongMessage({
      type: 'paddle-move',
      y: paddle.y
    });
  }

  /**
   * Renders the game on the canvas
   */
  function render() {
    const canvas = pongCanvasRef.current;
    if (!canvas || !gameState) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, gameState.leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, gameState.rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores at top
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.score.left.toString(), CANVAS_WIDTH / 4, 60);
    ctx.fillText(gameState.score.right.toString(), (3 * CANVAS_WIDTH) / 4, 60);

    // Draw lives
    ctx.font = '20px monospace';
    ctx.fillText(`❤️ ${gameState.lives.left}`, CANVAS_WIDTH / 4, 100);
    ctx.fillText(`❤️ ${gameState.lives.right}`, (3 * CANVAS_WIDTH) / 4, 100);
  }

  return {
    setupPongChannel,
    startGame,
    stopGame,
    movePaddle,
    getGameState: () => gameState,
    isGameActive: () => gameState !== null && !gameState.gameOver
  };
}
