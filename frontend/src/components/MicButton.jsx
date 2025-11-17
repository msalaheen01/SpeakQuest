import { useState, useEffect } from 'react';
import styles from '../styles/MicButton.module.css';

/**
 * Microphone Button Component
 * Simulates recording with visual feedback
 * 
 * Future: Can be extended to use real Web Audio API
 * for actual microphone recording
 */
export default function MicButton({ 
  isRecording, 
  onRecordStart, 
  onRecordStop, 
  disabled 
}) {
  const [recordingTime, setRecordingTime] = useState(0);

  // Simulate 2-second recording
  useEffect(() => {
    let interval;
    if (isRecording) {
      setRecordingTime(0);
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 0.1;
          if (newTime >= 2) {
            // Auto-stop after 2 seconds
            clearInterval(interval);
            onRecordStop();
            return 2;
          }
          return newTime;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, onRecordStop]);

  const handleClick = () => {
    if (disabled) return;
    
    if (isRecording) {
      onRecordStop();
    } else {
      onRecordStart();
    }
  };

  return (
    <div className={styles.micButtonContainer}>
      <button
        className={`${styles.micButton} ${isRecording ? styles.recording : ''} ${disabled ? styles.disabled : ''}`}
        onClick={handleClick}
        disabled={disabled}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        <span className={styles.micIcon}>🎤</span>
        {isRecording && (
          <span className={styles.recordingIndicator}>
            {Math.ceil(2 - recordingTime)}s
          </span>
        )}
      </button>
      {isRecording && (
        <div className={styles.recordingRing} />
      )}
    </div>
  );
}

