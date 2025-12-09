import { useState, useEffect, useRef } from 'react';
import styles from '../styles/MicButton.module.css';

/**
 * Microphone Button Component
 * Records audio using MediaRecorder API
 */
export default function MicButton({ 
  isRecording, 
  onRecordStart, 
  onRecordStop, 
  disabled 
}) {
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle recording
  useEffect(() => {
    let interval;
    if (isRecording) {
      setRecordingTime(0);
      startRecording();
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 0.1);
      }, 100);
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      stopRecording();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      chunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordStop(audioBlob);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      recorder.start();
      mediaRecorderRef.current = recorder;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
      onRecordStop(null);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleClick = () => {
    if (disabled) return;
    
    if (isRecording) {
      // Stop recording - the onstop handler will call onRecordStop with the blob
      stopRecording();
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
        <svg 
          className={styles.micIcon}
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
        {isRecording && (
          <span className={styles.recordingIndicator}>
            {Math.floor(recordingTime)}s
          </span>
        )}
      </button>
      {isRecording && (
        <div className={styles.recordingRing} />
      )}
    </div>
  );
}

