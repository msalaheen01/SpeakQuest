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
        <span className={styles.micIcon}>🎤</span>
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

