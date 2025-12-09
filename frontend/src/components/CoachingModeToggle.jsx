import { useState, useEffect } from 'react';
import { getCoachingMode, setCoachingMode, COACHING_MODES } from '../utils/coachingMode';
import styles from '../styles/CoachingModeToggle.module.css';

/**
 * Coaching Mode Toggle Component
 * Allows users to switch between Supportive, Analytical, and Minimal feedback modes
 */
export default function CoachingModeToggle({ onModeChange }) {
  const [currentMode, setCurrentMode] = useState(COACHING_MODES.SUPPORTIVE);

  useEffect(() => {
    const savedMode = getCoachingMode();
    setCurrentMode(savedMode);
  }, []);

  const handleModeChange = (mode) => {
    if (setCoachingMode(mode)) {
      setCurrentMode(mode);
      if (onModeChange) {
        onModeChange(mode);
      }
    }
  };

  return (
    <div className={styles.toggleContainer}>
      <div className={styles.label}>Coaching Mode:</div>
      <div className={styles.buttons}>
        <button
          className={`${styles.modeButton} ${currentMode === COACHING_MODES.SUPPORTIVE ? styles.active : ''}`}
          onClick={() => handleModeChange(COACHING_MODES.SUPPORTIVE)}
          title="Encouraging, softer wording"
        >
          Supportive
        </button>
        <button
          className={`${styles.modeButton} ${currentMode === COACHING_MODES.ANALYTICAL ? styles.active : ''}`}
          onClick={() => handleModeChange(COACHING_MODES.ANALYTICAL)}
          title="Technical, data-heavy"
        >
          Analytical
        </button>
        <button
          className={`${styles.modeButton} ${currentMode === COACHING_MODES.MINIMAL ? styles.active : ''}`}
          onClick={() => handleModeChange(COACHING_MODES.MINIMAL)}
          title="Just scores + Whisper output"
        >
          Minimal
        </button>
      </div>
    </div>
  );
}

