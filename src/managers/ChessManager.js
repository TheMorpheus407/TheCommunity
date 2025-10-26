/**
 * @fileoverview Chess Manager - Handles chess game logic and synchronization
 * @module managers/ChessManager
 *
 * This manager handles:
 * - Chess game state (board, current player, piece positions)
 * - ASCII board rendering
 * - Move validation (basic - no complex rules for now)
 * - Turn management
 * - Synchronization over WebRTC data channel
 * - Game lifecycle (start, move, end)
 */

import { CHESS_CHANNEL_LABEL } from '../core/constants.js';

/**
 * Creates a factory for Chess game operations
 * @param {Object} deps - Dependencies object
 * @param {React.MutableRefObject} deps.chessChannelRef - Chess data channel reference
 * @param {Function} deps.appendMessage - Message appender function
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Object} deps.t - Translation object
 * @returns {Object} Chess game operations
 * @export
 */
export function createChessManager(deps) {
  const {
    chessChannelRef,
    appendMessage,
    appendSystemMessage,
    t
  } = deps;

  // Game state
  let gameState = null;
  let isWhite = false; // Whether this player plays white pieces

  /**
   * Initializes the game state with standard chess starting position
   * @param {boolean} asWhite - Whether this player plays white (white starts)
   */
  function initializeGameState(asWhite) {
    isWhite = asWhite;

    // Standard chess starting position
    // Uppercase = White pieces, Lowercase = Black pieces
    // K/k = King, Q/q = Queen, R/r = Rook, N/n = Knight, B/b = Bishop, P/p = Pawn
    gameState = {
      board: [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], // Black back rank
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // Black pawns
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // White pawns
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']  // White back rank
      ],
      whiteToMove: true,
      gameActive: true
    };
  }

  /**
   * Renders the chess board as ASCII art
   * @returns {string} ASCII representation of the board
   */
  function renderBoard() {
    if (!gameState) return '';

    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let ascii = '\n```\n';
    ascii += '  +---+---+---+---+---+---+---+---+\n';

    for (let row = 0; row < 8; row++) {
      const rowNum = 8 - row;
      ascii += `${rowNum} |`;

      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        ascii += ` ${piece} |`;
      }

      ascii += `\n  +---+---+---+---+---+---+---+---+\n`;
    }

    ascii += '    a   b   c   d   e   f   g   h\n';
    ascii += '```\n';

    const turn = gameState.whiteToMove ? 'White' : 'Black';
    ascii += `\n${turn} to move`;

    return ascii;
  }

  /**
   * Converts algebraic notation to board coordinates
   * @param {string} square - Square in algebraic notation (e.g., 'e2')
   * @returns {Object|null} {row, col} or null if invalid
   */
  function parseSquare(square) {
    if (!square || square.length !== 2) return null;

    const col = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 8 - parseInt(square[1], 10);

    if (col < 0 || col > 7 || row < 0 || row > 7) return null;

    return { row, col };
  }

  /**
   * Checks if a piece belongs to the current player
   * @param {string} piece - The piece character
   * @param {boolean} whiteToMove - Whether it's white's turn
   * @returns {boolean} True if piece belongs to current player
   */
  function isOwnPiece(piece, whiteToMove) {
    if (piece === ' ') return false;
    const isUpperCase = piece === piece.toUpperCase();
    return whiteToMove === isUpperCase;
  }

  /**
   * Attempts to move a piece (basic validation, no complex chess rules)
   * @param {string} from - Starting square (e.g., 'e2')
   * @param {string} to - Destination square (e.g., 'e4')
   * @returns {boolean} True if move was successful
   */
  function makeMove(from, to) {
    if (!gameState || !gameState.gameActive) return false;

    const fromPos = parseSquare(from);
    const toPos = parseSquare(to);

    if (!fromPos || !toPos) {
      appendSystemMessage(t?.chess?.invalidSquare || 'Invalid square notation');
      return false;
    }

    const piece = gameState.board[fromPos.row][fromPos.col];

    // Check if there's a piece at the source
    if (piece === ' ') {
      appendSystemMessage(t?.chess?.noPiece || 'No piece at source square');
      return false;
    }

    // Check if it's the right player's turn
    if (!isOwnPiece(piece, gameState.whiteToMove)) {
      appendSystemMessage(t?.chess?.wrongPiece || 'Not your piece');
      return false;
    }

    // Check if not moving to same square
    if (fromPos.row === toPos.row && fromPos.col === toPos.col) {
      appendSystemMessage(t?.chess?.sameSquare || 'Cannot move to same square');
      return false;
    }

    // Basic move execution (no validation of legal chess moves as per requirements)
    const capturedPiece = gameState.board[toPos.row][toPos.col];

    // Don't capture own pieces
    if (capturedPiece !== ' ' && isOwnPiece(capturedPiece, gameState.whiteToMove)) {
      appendSystemMessage(t?.chess?.ownPiece || 'Cannot capture own piece');
      return false;
    }

    // Execute the move
    gameState.board[toPos.row][toPos.col] = piece;
    gameState.board[fromPos.row][fromPos.col] = ' ';

    // Switch turns
    gameState.whiteToMove = !gameState.whiteToMove;

    return true;
  }

  /**
   * Sets up the Chess data channel for game synchronization
   * @param {RTCDataChannel} channel - The Chess data channel
   */
  function setupChessChannel(channel) {
    chessChannelRef.current = channel;

    channel.onopen = () => {
      appendSystemMessage(t?.chess?.channelReady || 'Chess channel ready');
    };

    channel.onclose = () => {
      stopGame();
      appendSystemMessage(t?.chess?.channelClosed || 'Chess channel closed');
    };

    channel.onerror = (err) => {
      console.error('Chess channel error:', err);
      appendSystemMessage(t?.chess?.channelError || 'Chess channel error');
    };

    channel.onmessage = (event) => {
      // Security: Validate payload type
      if (typeof event.data !== 'string') {
        return;
      }

      try {
        const data = JSON.parse(event.data);

        // Security: Validate message structure
        if (!data || typeof data !== 'object' || typeof data.type !== 'string') {
          return;
        }

        handleChessMessage(data);
      } catch (err) {
        console.error('Failed to parse Chess message:', err);
      }
    };
  }

  /**
   * Handles incoming Chess messages
   * @param {Object} data - The message data
   */
  function handleChessMessage(data) {
    switch (data.type) {
      case 'start-game':
        // Opponent initiated the game
        startGame(false);
        sendChessMessage({ type: 'game-started' });
        const board = renderBoard();
        appendMessage(board, 'system');
        break;

      case 'game-started':
        // Opponent acknowledged game start
        appendSystemMessage(t?.chess?.gameStarted || 'Chess game started!');
        const startBoard = renderBoard();
        appendMessage(startBoard, 'system');
        break;

      case 'move':
        // Opponent made a move
        if (gameState) {
          // Security: Validate move data
          if (typeof data.from !== 'string' || typeof data.to !== 'string') {
            return;
          }
          // Security: Validate square notation format (a1-h8)
          if (!/^[a-h][1-8]$/i.test(data.from) || !/^[a-h][1-8]$/i.test(data.to)) {
            return;
          }

          const success = makeMove(data.from, data.to);
          if (success) {
            const boardAfterMove = renderBoard();
            appendMessage(boardAfterMove, 'system');
            appendSystemMessage(t?.chess?.opponentMoved || `Opponent moved: ${data.from}-${data.to}`);
          }
        }
        break;

      case 'end-game':
        stopGame();
        appendSystemMessage(t?.chess?.gameEnded || 'Chess game ended');
        break;

      default:
        console.warn('Unknown Chess message type:', data.type);
    }
  }

  /**
   * Sends a Chess message over the data channel
   * @param {Object} message - The message to send
   */
  function sendChessMessage(message) {
    const channel = chessChannelRef.current;
    if (channel && channel.readyState === 'open') {
      try {
        channel.send(JSON.stringify(message));
      } catch (err) {
        console.error('Failed to send Chess message:', err);
      }
    }
  }

  /**
   * Starts a new chess game
   * @param {boolean} asWhite - Whether this player plays white
   */
  function startGame(asWhite) {
    // If there's an active game, end it first
    if (gameState && gameState.gameActive) {
      sendChessMessage({ type: 'end-game' });
      stopGame();
    }

    initializeGameState(asWhite);

    if (asWhite) {
      sendChessMessage({ type: 'start-game' });
      appendSystemMessage(t?.chess?.challengeSent || 'Chess challenge sent!');
    }
  }

  /**
   * Handles a move command from chat
   * @param {string} from - Starting square
   * @param {string} to - Destination square
   * @returns {boolean} True if move was successful
   */
  function handleMove(from, to) {
    if (!gameState || !gameState.gameActive) {
      appendSystemMessage(t?.chess?.noActiveGame || 'No active chess game. Start one with @chess');
      return false;
    }

    // Check if it's this player's turn
    const isMyTurn = (isWhite && gameState.whiteToMove) || (!isWhite && !gameState.whiteToMove);

    if (!isMyTurn) {
      appendSystemMessage(t?.chess?.notYourTurn || 'Not your turn!');
      return false;
    }

    const success = makeMove(from, to);

    if (success) {
      // Send move to opponent
      sendChessMessage({
        type: 'move',
        from,
        to
      });

      // Display updated board
      const board = renderBoard();
      appendMessage(board, 'system');

      return true;
    }

    return false;
  }

  /**
   * Stops the chess game and cleans up
   */
  function stopGame() {
    if (gameState) {
      gameState.gameActive = false;
    }
    gameState = null;
  }

  /**
   * Checks if a game is currently active
   * @returns {boolean} True if game is active
   */
  function isGameActive() {
    return gameState !== null && gameState.gameActive;
  }

  /**
   * Gets the current game state
   * @returns {Object|null} Current game state
   */
  function getGameState() {
    return gameState;
  }

  return {
    setupChessChannel,
    startGame,
    handleMove,
    stopGame,
    isGameActive,
    getGameState
  };
}
