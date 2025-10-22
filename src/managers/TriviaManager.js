/**
 * @fileoverview Trivia Manager - Handles trivia quiz game logic and synchronization
 * @module managers/TriviaManager
 *
 * This manager handles:
 * - Trivia game state (questions, scores, timers)
 * - Question synchronization between peers
 * - Answer submission and validation
 * - Score calculation and winner determination
 * - Synchronization over WebRTC data channel
 * - Game lifecycle (start, question flow, end)
 */

import { TRIVIA_CHANNEL_LABEL } from '../core/constants.js';
import { getQuestionsBySeed } from '../data/triviaQuestions.js';

/**
 * Creates a factory for Trivia game operations
 * @param {Object} deps - Dependencies object
 * @param {React.MutableRefObject} deps.triviaChannelRef - Trivia data channel reference
 * @param {Function} deps.setTriviaGameActive - Trivia game active state setter
 * @param {Function} deps.setTriviaGameState - Trivia game state setter
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Object} deps.t - Translation object
 * @returns {Object} Trivia game operations
 * @export
 */
export function createTriviaManager(deps) {
  const {
    triviaChannelRef,
    setTriviaGameActive,
    setTriviaGameState,
    appendSystemMessage,
    t
  } = deps;

  // Game constants
  const ANSWER_TIME_SECONDS = 15;
  const REVEAL_TIME_SECONDS = 3;

  // Game state
  let gameState = null;
  let isHost = false;
  let answerTimer = null;
  let revealTimer = null;

  /**
   * Initializes the game state
   * @param {boolean} asHost - Whether this player is the host
   * @param {number} questionCount - Number of questions to play
   * @param {number} seed - Random seed for question selection
   */
  function initializeGameState(asHost, questionCount, seed) {
    isHost = asHost;

    // Get synchronized questions using seed
    const questions = getQuestionsBySeed(questionCount, seed);

    gameState = {
      questions,
      currentQuestionIndex: 0,
      questionCount,
      seed,
      localScore: 0,
      remoteScore: 0,
      localAnswer: null,
      remoteAnswer: null,
      localAnswerTime: null,
      remoteAnswerTime: null,
      phase: 'waiting', // waiting, answering, revealing, summary
      timeRemaining: ANSWER_TIME_SECONDS,
      gameOver: false,
      winner: null
    };
  }

  /**
   * Sets up the Trivia data channel for game synchronization
   * @param {RTCDataChannel} channel - The Trivia data channel
   */
  function setupTriviaChannel(channel) {
    triviaChannelRef.current = channel;

    channel.onopen = () => {
      appendSystemMessage(t.trivia.channelReady);
    };

    channel.onclose = () => {
      stopGame();
      appendSystemMessage(t.trivia.channelClosed);
    };

    channel.onerror = (err) => {
      console.error('Trivia channel error:', err);
      appendSystemMessage(t.trivia.channelError);
    };

    channel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleTriviaMessage(data);
      } catch (err) {
        console.error('Failed to parse Trivia message:', err);
      }
    };
  }

  /**
   * Handles incoming Trivia messages
   * @param {Object} data - The message data
   */
  function handleTriviaMessage(data) {
    switch (data.type) {
      case 'start-game':
        // Opponent initiated the game
        startGame(false, data.questionCount, data.seed);
        sendTriviaMessage({ type: 'game-started' });
        break;

      case 'game-started':
        // Opponent acknowledged game start
        if (gameState && isHost) {
          // Host can now start first question
          startQuestion();
        }
        break;

      case 'start-question':
        // Host signals to start answering a question
        if (gameState && !isHost) {
          startAnswering();
        }
        break;

      case 'submit-answer':
        // Opponent submitted their answer
        if (gameState) {
          gameState.remoteAnswer = data.answerIndex;
          gameState.remoteAnswerTime = data.timeRemaining;
          updateUIState();

          // If both answered, host triggers reveal
          if (isHost && gameState.localAnswer !== null && gameState.remoteAnswer !== null) {
            revealAnswers();
          }
        }
        break;

      case 'reveal-answers':
        // Host triggers answer reveal
        if (gameState && !isHost) {
          showReveal(data.localCorrect, data.remoteCorrect, data.localScore, data.remoteScore);
        }
        break;

      case 'next-question':
        // Host signals to move to next question
        if (gameState && !isHost) {
          nextQuestion();
        }
        break;

      case 'game-over':
        // Game finished
        if (gameState) {
          endGame(data.localScore, data.remoteScore, data.winner);
        }
        break;

      default:
        console.warn('Unknown Trivia message type:', data.type);
    }
  }

  /**
   * Sends a Trivia message over the data channel
   * @param {Object} message - The message to send
   */
  function sendTriviaMessage(message) {
    const channel = triviaChannelRef.current;
    if (channel && channel.readyState === 'open') {
      try {
        channel.send(JSON.stringify(message));
      } catch (err) {
        console.error('Failed to send Trivia message:', err);
      }
    }
  }

  /**
   * Starts the Trivia game
   * @param {boolean} asHost - Whether this player is the host
   * @param {number} questionCount - Number of questions to play
   * @param {number} seed - Random seed (optional, generated if host)
   */
  function startGame(asHost, questionCount = 5, seed = null) {
    if (gameState) {
      stopGame();
    }

    // Generate seed if host
    if (asHost && seed === null) {
      seed = Math.floor(Math.random() * 1000000);
    }

    initializeGameState(asHost, questionCount, seed);
    setTriviaGameActive(true);
    updateUIState();

    if (asHost) {
      sendTriviaMessage({
        type: 'start-game',
        questionCount,
        seed
      });
      appendSystemMessage(t.trivia.challengeSent);
    } else {
      appendSystemMessage(t.trivia.gameStarted);
    }
  }

  /**
   * Starts the current question (host only)
   */
  function startQuestion() {
    if (!gameState || !isHost) return;

    gameState.phase = 'answering';
    gameState.localAnswer = null;
    gameState.remoteAnswer = null;
    gameState.localAnswerTime = null;
    gameState.remoteAnswerTime = null;
    gameState.timeRemaining = ANSWER_TIME_SECONDS;

    updateUIState();
    sendTriviaMessage({ type: 'start-question' });
    startAnswering();
  }

  /**
   * Starts the answering phase with timer
   */
  function startAnswering() {
    if (!gameState) return;

    gameState.phase = 'answering';
    gameState.timeRemaining = ANSWER_TIME_SECONDS;
    updateUIState();

    // Clear any existing timer
    if (answerTimer) {
      clearInterval(answerTimer);
    }

    // Start countdown timer
    answerTimer = setInterval(() => {
      if (!gameState) {
        clearInterval(answerTimer);
        return;
      }

      gameState.timeRemaining--;
      updateUIState();

      if (gameState.timeRemaining <= 0) {
        clearInterval(answerTimer);
        answerTimer = null;

        // Time's up - auto-submit null answer if not answered
        if (gameState.localAnswer === null) {
          submitAnswer(null);
        }

        // If host and both answered (or timed out), reveal
        if (isHost) {
          revealAnswers();
        }
      }
    }, 1000);
  }

  /**
   * Submits the player's answer
   * @param {number|null} answerIndex - Index of selected answer (0-3) or null for no answer
   */
  function submitAnswer(answerIndex) {
    if (!gameState || gameState.phase !== 'answering') return;
    if (gameState.localAnswer !== null) return; // Already answered

    gameState.localAnswer = answerIndex;
    gameState.localAnswerTime = gameState.timeRemaining;
    updateUIState();

    // Send answer to opponent
    sendTriviaMessage({
      type: 'submit-answer',
      answerIndex,
      timeRemaining: gameState.timeRemaining
    });

    // If host and both answered, reveal immediately
    if (isHost && gameState.remoteAnswer !== null) {
      clearInterval(answerTimer);
      answerTimer = null;
      revealAnswers();
    }
  }

  /**
   * Reveals the answers and updates scores (host only)
   */
  function revealAnswers() {
    if (!gameState || !isHost) return;

    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const localCorrect = gameState.localAnswer === currentQuestion.correctAnswer;
    const remoteCorrect = gameState.remoteAnswer === currentQuestion.correctAnswer;

    // Calculate scores with time bonus
    if (localCorrect) {
      const timeBonus = Math.floor((gameState.localAnswerTime || 0) * 10);
      gameState.localScore += 100 + timeBonus;
    }

    if (remoteCorrect) {
      const timeBonus = Math.floor((gameState.remoteAnswerTime || 0) * 10);
      gameState.remoteScore += 100 + timeBonus;
    }

    // Broadcast reveal to client
    sendTriviaMessage({
      type: 'reveal-answers',
      localCorrect,
      remoteCorrect,
      localScore: gameState.localScore,
      remoteScore: gameState.remoteScore
    });

    showReveal(localCorrect, remoteCorrect, gameState.localScore, gameState.remoteScore);
  }

  /**
   * Shows the answer reveal phase
   * @param {boolean} localCorrect - Whether local answer was correct
   * @param {boolean} remoteCorrect - Whether remote answer was correct
   * @param {number} localScore - Updated local score
   * @param {number} remoteScore - Updated remote score
   */
  function showReveal(localCorrect, remoteCorrect, localScore, remoteScore) {
    if (!gameState) return;

    gameState.phase = 'revealing';
    gameState.localScore = localScore;
    gameState.remoteScore = remoteScore;
    updateUIState();

    // Clear any existing timer
    if (revealTimer) {
      clearTimeout(revealTimer);
    }

    // Show reveal for a few seconds, then move to next question or end
    revealTimer = setTimeout(() => {
      revealTimer = null;

      if (gameState.currentQuestionIndex + 1 < gameState.questionCount) {
        // More questions to go
        if (isHost) {
          sendTriviaMessage({ type: 'next-question' });
          nextQuestion();
        }
      } else {
        // Game over
        const winner = localScore > remoteScore ? 'local' :
                      remoteScore > localScore ? 'remote' : 'tie';

        if (isHost) {
          sendTriviaMessage({
            type: 'game-over',
            localScore,
            remoteScore,
            winner
          });
        }

        endGame(localScore, remoteScore, winner);
      }
    }, REVEAL_TIME_SECONDS * 1000);
  }

  /**
   * Moves to the next question
   */
  function nextQuestion() {
    if (!gameState) return;

    gameState.currentQuestionIndex++;

    if (isHost) {
      startQuestion();
    } else {
      gameState.phase = 'waiting';
      updateUIState();
    }
  }

  /**
   * Ends the game and shows summary
   * @param {number} localScore - Final local score
   * @param {number} remoteScore - Final remote score
   * @param {string} winner - 'local', 'remote', or 'tie'
   */
  function endGame(localScore, remoteScore, winner) {
    if (!gameState) return;

    gameState.gameOver = true;
    gameState.winner = winner;
    gameState.phase = 'summary';
    gameState.localScore = localScore;
    gameState.remoteScore = remoteScore;

    updateUIState();

    // Show system message
    if (winner === 'local') {
      appendSystemMessage(t.trivia.victory);
    } else if (winner === 'remote') {
      appendSystemMessage(t.trivia.defeat);
    } else {
      appendSystemMessage(t.trivia.tie);
    }
  }

  /**
   * Stops the Trivia game and cleans up
   */
  function stopGame() {
    if (answerTimer) {
      clearInterval(answerTimer);
      answerTimer = null;
    }
    if (revealTimer) {
      clearTimeout(revealTimer);
      revealTimer = null;
    }

    gameState = null;
    setTriviaGameActive(false);
    updateUIState();
  }

  /**
   * Updates the UI state in React
   */
  function updateUIState() {
    if (gameState) {
      setTriviaGameState({ ...gameState });
    } else {
      setTriviaGameState(null);
    }
  }

  /**
   * Gets the current game state (for UI)
   * @returns {Object|null} Current game state
   */
  function getGameState() {
    return gameState;
  }

  /**
   * Checks if game is currently active
   * @returns {boolean} True if game is active
   */
  function isGameActive() {
    return gameState !== null && !gameState.gameOver;
  }

  return {
    setupTriviaChannel,
    startGame,
    stopGame,
    submitAnswer,
    getGameState,
    isGameActive
  };
}
