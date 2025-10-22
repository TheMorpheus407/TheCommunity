/**
 * Trivia UI Component Generator
 * Creates React elements for the trivia quiz game interface
 */

/**
 * Renders the trivia game UI section
 * @param {Object} props - Component props
 * @param {boolean} props.isTriviaActive - Whether trivia game is active
 * @param {Object|null} props.triviaGameState - Current game state
 * @param {number} props.triviaQuestionCount - Selected question count
 * @param {Function} props.setTriviaQuestionCount - Question count setter
 * @param {boolean} props.channelReady - Whether WebRTC channel is ready
 * @param {Function} props.handleStartTrivia - Start game handler
 * @param {Function} props.handleStopTrivia - Stop game handler
 * @param {Function} props.handleTriviaAnswer - Answer submission handler
 * @param {Object} props.t - Translations object
 * @returns {React.Element} Trivia section element
 */
function renderTriviaSection(props) {
  const {
    isTriviaActive,
    triviaGameState,
    triviaQuestionCount,
    setTriviaQuestionCount,
    channelReady,
    handleStartTrivia,
    handleStopTrivia,
    handleTriviaAnswer,
    t
  } = props;

  return React.createElement('section', { id: 'trivia', className: 'trivia-section' },
    React.createElement('header', null,
      React.createElement('div', { className: 'header-content' },
        React.createElement('h2', null, t.trivia.title)
      )
    ),
    React.createElement('div', { className: 'trivia-content' },
      // Game setup (when not active)
      !isTriviaActive && React.createElement('div', { className: 'trivia-setup' },
        React.createElement('div', { className: 'trivia-question-selector' },
          React.createElement('label', { htmlFor: 'trivia-question-count' }, t.trivia.selectQuestions),
          React.createElement('select', {
            id: 'trivia-question-count',
            value: triviaQuestionCount,
            onChange: (e) => setTriviaQuestionCount(parseInt(e.target.value, 10)),
            disabled: !channelReady
          },
            React.createElement('option', { value: 5 }, '5 ' + t.trivia.questionCount(5).split(' ').slice(1).join(' ')),
            React.createElement('option', { value: 10 }, '10 ' + t.trivia.questionCount(10).split(' ').slice(1).join(' ')),
            React.createElement('option', { value: 15 }, '15 ' + t.trivia.questionCount(15).split(' ').slice(1).join(' ')),
            React.createElement('option', { value: 20 }, '20 ' + t.trivia.questionCount(20).split(' ').slice(1).join(' '))
          )
        ),
        React.createElement('button', {
          onClick: handleStartTrivia,
          disabled: !channelReady,
          className: 'trivia-start-button'
        }, channelReady ? t.trivia.challengeButton : t.trivia.challengeButtonDisabled)
      ),

      // Active game display
      isTriviaActive && triviaGameState && React.createElement('div', { className: 'trivia-game-active' },
        // Question header
        React.createElement('div', { className: 'trivia-question-header' },
          React.createElement('div', { className: 'trivia-progress' },
            t.trivia.questionNumber(triviaGameState.currentQuestionIndex + 1, triviaGameState.questionCount)
          ),
          triviaGameState.phase === 'answering' && React.createElement('div', { className: 'trivia-timer' },
            t.trivia.timeRemaining(triviaGameState.timeRemaining)
          )
        ),

        // Score display
        React.createElement('div', { className: 'trivia-scores' },
          React.createElement('div', { className: 'trivia-score-item' },
            React.createElement('div', { className: 'trivia-score-label' }, t.trivia.yourScore),
            React.createElement('div', { className: 'trivia-score-value' }, triviaGameState.localScore)
          ),
          React.createElement('div', { className: 'trivia-score-item' },
            React.createElement('div', { className: 'trivia-score-label' }, t.trivia.peerScore),
            React.createElement('div', { className: 'trivia-score-value' }, triviaGameState.remoteScore)
          )
        ),

        // Current question
        triviaGameState.questions && triviaGameState.questions[triviaGameState.currentQuestionIndex] &&
        React.createElement('div', { className: 'trivia-question-display' },
          React.createElement('div', { className: 'trivia-category' },
            t.trivia.category + ': ' + triviaGameState.questions[triviaGameState.currentQuestionIndex].category
          ),
          React.createElement('div', { className: 'trivia-question-text' },
            triviaGameState.questions[triviaGameState.currentQuestionIndex].question
          ),

          // Answer options (during answering phase)
          triviaGameState.phase === 'answering' && React.createElement('div', { className: 'trivia-answers' },
            triviaGameState.questions[triviaGameState.currentQuestionIndex].options.map((option, index) =>
              React.createElement('button', {
                key: index,
                className: `trivia-answer-button ${triviaGameState.localAnswer === index ? 'selected' : ''}`,
                onClick: () => handleTriviaAnswer(index),
                disabled: triviaGameState.localAnswer !== null
              }, option)
            )
          ),

          // Answer reveal (during revealing phase)
          triviaGameState.phase === 'revealing' && React.createElement('div', { className: 'trivia-reveal' },
            React.createElement('div', { className: 'trivia-reveal-section' },
              React.createElement('h3', null, t.trivia.yourAnswer),
              React.createElement('div', { className: `trivia-reveal-answer ${triviaGameState.localAnswer === triviaGameState.questions[triviaGameState.currentQuestionIndex].correctAnswer ? 'correct' : 'wrong'}` },
                triviaGameState.localAnswer !== null ?
                  triviaGameState.questions[triviaGameState.currentQuestionIndex].options[triviaGameState.localAnswer] :
                  t.trivia.noAnswer
              ),
              React.createElement('div', { className: 'trivia-reveal-status' },
                triviaGameState.localAnswer === triviaGameState.questions[triviaGameState.currentQuestionIndex].correctAnswer ?
                  t.trivia.correctAnswer : t.trivia.wrongAnswer
              )
            ),
            React.createElement('div', { className: 'trivia-reveal-section' },
              React.createElement('h3', null, t.trivia.peerAnswer),
              React.createElement('div', { className: `trivia-reveal-answer ${triviaGameState.remoteAnswer === triviaGameState.questions[triviaGameState.currentQuestionIndex].correctAnswer ? 'correct' : 'wrong'}` },
                triviaGameState.remoteAnswer !== null ?
                  triviaGameState.questions[triviaGameState.currentQuestionIndex].options[triviaGameState.remoteAnswer] :
                  t.trivia.noAnswer
              ),
              React.createElement('div', { className: 'trivia-reveal-status' },
                triviaGameState.remoteAnswer === triviaGameState.questions[triviaGameState.currentQuestionIndex].correctAnswer ?
                  t.trivia.correctAnswer : t.trivia.wrongAnswer
              )
            )
          ),

          // Waiting message
          (triviaGameState.phase === 'waiting' || triviaGameState.phase === 'revealing') &&
          React.createElement('div', { className: 'trivia-waiting' },
            triviaGameState.phase === 'revealing' ? t.trivia.waitingForNextQuestion : t.trivia.waitingForAnswer
          )
        ),

        // Game summary
        triviaGameState.phase === 'summary' && React.createElement('div', { className: 'trivia-summary' },
          React.createElement('div', { className: 'trivia-winner-announcement' },
            triviaGameState.winner === 'local' && React.createElement('div', { className: 'trivia-victory' },
              React.createElement('h2', null, t.trivia.congratulations),
              React.createElement('p', { className: 'trivia-winner-text' }, t.trivia.youWin)
            ),
            triviaGameState.winner === 'remote' && React.createElement('div', { className: 'trivia-defeat' },
              React.createElement('h2', null, t.trivia.wellPlayed),
              React.createElement('p', { className: 'trivia-loser-text' }, t.trivia.defeat)
            ),
            triviaGameState.winner === 'tie' && React.createElement('div', { className: 'trivia-tie' },
              React.createElement('h2', null, t.trivia.tieGame),
              React.createElement('p', { className: 'trivia-tie-text' }, t.trivia.tie)
            )
          ),
          React.createElement('div', { className: 'trivia-final-scores' },
            React.createElement('h3', null, t.trivia.finalScore),
            React.createElement('div', { className: 'trivia-final-score-row' },
              React.createElement('span', null, t.trivia.yourScore + ':'),
              React.createElement('strong', null, triviaGameState.localScore)
            ),
            React.createElement('div', { className: 'trivia-final-score-row' },
              React.createElement('span', null, t.trivia.peerScore + ':'),
              React.createElement('strong', null, triviaGameState.remoteScore)
            )
          )
        ),

        // Controls
        React.createElement('div', { className: 'trivia-controls' },
          React.createElement('button', {
            onClick: handleStopTrivia,
            className: 'trivia-stop-button'
          }, t.trivia.closeGame)
        )
      )
    )
  );
}

// Export for use in app.js
window.renderTriviaSection = renderTriviaSection;
