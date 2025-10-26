/**
 * @fileoverview Flappy Bird Manager - Handles Flappy Bird game logic and P2P integration
 * @module managers/FlappyBirdManager
 *
 * This manager handles:
 * - Flappy Bird game state and lifecycle
 * - High score sharing over WebRTC
 * - Challenge system for competitive play
 * - Game event callbacks and notifications
 */

import { FLAPPYBIRD_CHANNEL_LABEL } from '../core/constants.js';

/**
 * Creates a factory for Flappy Bird game operations
 * @param {Object} deps - Dependencies object
 * @param {React.MutableRefObject} deps.flappyBirdChannelRef - Flappy Bird data channel reference
 * @param {React.MutableRefObject} deps.flappyBirdCanvasRef - Canvas element reference
 * @param {React.MutableRefObject} deps.flappyBirdGameRef - Game instance reference
 * @param {Function} deps.setFlappyBirdGameActive - Game active state setter
 * @param {Function} deps.setFlappyBirdScore - Score state setter
 * @param {Function} deps.setFlappyBirdHighScore - High score state setter
 * @param {Function} deps.appendMessage - Message appender function
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Object} deps.t - Translation object
 * @returns {Object} Flappy Bird game operations
 * @export
 */
export function createFlappyBirdManager(deps) {
  const {
    flappyBirdChannelRef,
    flappyBirdCanvasRef,
    flappyBirdGameRef,
    setFlappyBirdGameActive,
    setFlappyBirdScore,
    setFlappyBirdHighScore,
    appendMessage,
    appendSystemMessage,
    t
  } = deps;

  /**
   * Sets up the Flappy Bird data channel for game synchronization
   * @param {RTCDataChannel} channel - The Flappy Bird data channel
   */
  function setupFlappyBirdChannel(channel) {
    flappyBirdChannelRef.current = channel;

    channel.onopen = () => {
      appendSystemMessage(t.flappyBird?.channelReady || 'Flappy Bird channel ready!');
    };

    channel.onclose = () => {
      appendSystemMessage(t.flappyBird?.channelClosed || 'Flappy Bird channel closed.');
    };

    channel.onerror = (err) => {
      console.error('Flappy Bird channel error:', err);
      appendSystemMessage(t.flappyBird?.channelError || 'Flappy Bird channel error.');
    };

    // Messages are handled by the game instance directly
  }

  /**
   * Starts a new Flappy Bird game
   */
  function startGame() {
    const canvas = flappyBirdCanvasRef.current;
    const channel = flappyBirdChannelRef.current;

    if (!canvas) {
      console.error('Canvas not available for Flappy Bird game');
      return;
    }

    // Clean up existing game if any
    if (flappyBirdGameRef.current) {
      flappyBirdGameRef.current.destroy();
    }

    // Create new game instance
    const game = new window.FlappyBirdGame(canvas, channel, {
      onGameStarted: () => {
        setFlappyBirdGameActive(true);
        setFlappyBirdScore(0);
        appendSystemMessage(t.flappyBird?.gameStarted || 'Flappy Bird game started! Good luck!');
      },

      onScoreUpdate: (score) => {
        setFlappyBirdScore(score);
      },

      onGameOver: (score, highScore) => {
        setFlappyBirdScore(score);
        setFlappyBirdHighScore(highScore);

        if (score === highScore && score > 0) {
          appendSystemMessage(
            t.flappyBird?.newHighScore || `Game Over! New high score: ${score}! 🎉`
          );
        } else {
          appendSystemMessage(
            t.flappyBird?.gameOver || `Game Over! Score: ${score}. Press Space to restart.`
          );
        }
      },

      onChallengeReceived: (score) => {
        appendSystemMessage(
          t.flappyBird?.challengeReceived ||
          `Your peer challenges you to beat their score of ${score}! 🏆`
        );
      },

      onHighScoreReceived: (score) => {
        appendSystemMessage(
          t.flappyBird?.highScoreReceived ||
          `Your peer achieved a new high score: ${score}! 🌟`
        );
      }
    });

    flappyBirdGameRef.current = game;
    game.startGame();
  }

  /**
   * Stops the current Flappy Bird game
   */
  function stopGame() {
    if (flappyBirdGameRef.current) {
      flappyBirdGameRef.current.destroy();
      flappyBirdGameRef.current = null;
    }
    setFlappyBirdGameActive(false);
  }

  /**
   * Sends a challenge to the peer with current score
   */
  function sendChallenge() {
    const game = flappyBirdGameRef.current;
    if (game) {
      const score = game.getCurrentScore();
      if (score > 0) {
        game.sendChallenge();
        appendSystemMessage(
          t.flappyBird?.challengeSent ||
          `Challenge sent! You scored ${score}.`
        );
      }
    }
  }

  /**
   * Gets the current game state
   * @returns {Object|null} Current game state or null
   */
  function getGameState() {
    return flappyBirdGameRef.current;
  }

  /**
   * Checks if game is currently active
   * @returns {boolean} True if game is active
   */
  function isGameActive() {
    return flappyBirdGameRef.current?.isGameActive() || false;
  }

  /**
   * Gets the current high score
   * @returns {number} Current high score
   */
  function getHighScore() {
    return flappyBirdGameRef.current?.getHighScore() || 0;
  }

  /**
   * Gets the current score
   * @returns {number} Current score
   */
  function getCurrentScore() {
    return flappyBirdGameRef.current?.getCurrentScore() || 0;
  }

  return {
    setupFlappyBirdChannel,
    startGame,
    stopGame,
    sendChallenge,
    getGameState,
    isGameActive,
    getHighScore,
    getCurrentScore
  };
}
