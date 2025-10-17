/**
 * @fileoverview Sound effects and audio easter eggs.
 * @module utils/soundEffects
 */

/**
 * Initialize background sound to play on first user interaction.
 * Modern browsers require user interaction before allowing audio playback.
 * @export
 */
export function initBackgroundSound() {
  const audio = document.getElementById('background-sound');
  if (!audio) {
    return;
  }

  audio.volume = 1.0;

  let hasStarted = false;

  const startAudio = () => {
    if (hasStarted) {
      return;
    }

    audio.play().then(() => {
      hasStarted = true;
      document.removeEventListener('click', startAudio);
      document.removeEventListener('pointerdown', startAudio);
      document.removeEventListener('keydown', startAudio);
      document.removeEventListener('touchstart', startAudio);
    }).catch((error) => {
      console.warn('Background sound autoplay blocked:', error);
    });
  };

  document.addEventListener('click', startAudio, { once: false });
  document.addEventListener('pointerdown', startAudio, { once: false });
  document.addEventListener('keydown', startAudio, { once: false });
  document.addEventListener('touchstart', startAudio, { once: false });
}

/**
 * Konami Code Easter Egg.
 * Detects the sequence: ↑ ↑ ↓ ↓ ← → ← → B A
 * When activated, toggles the Nyan Cat music.
 * @export
 */
export function initKonamiCode() {
  const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA'
  ];

  let konamiIndex = 0;
  let isAudioPlaying = false;

  function handleKonamiKeyPress(event) {
    const expectedKey = KONAMI_CODE[konamiIndex];

    if (event.code === expectedKey) {
      konamiIndex++;

      if (konamiIndex === KONAMI_CODE.length) {
        activateNyanCat();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  }

  function activateNyanCat() {
    const audio = document.getElementById('nyan-cat-audio');

    if (!audio) {
      console.warn('Nyan Cat audio element not found');
      return;
    }

    if (isAudioPlaying) {
      audio.pause();
      audio.currentTime = 0;
      isAudioPlaying = false;
    } else {
      audio.play().then(() => {
        isAudioPlaying = true;
      }).catch((error) => {
        console.warn('Failed to play Nyan Cat audio:', error);
      });
    }
  }

  document.addEventListener('keydown', handleKonamiKeyPress);
}
