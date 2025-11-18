import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MicButton from '../components/MicButton';
import styles from '../styles/Practice.module.css';
import { analyzeSpeech } from '../api';

/**
 * Practice Screen
 * Main interaction loop:
 * 1. Show speech prompt
 * 2. User clicks mic to record
 * 3. Show "Analyzing..." state
 * 4. Display feedback
 * 5. Move to next prompt or complete
 */

// Speech prompts array
const PROMPTS = [
  "Say the word: 'Rabbit'",
  "Try saying: 'Red'",
  "Say this sentence: 'The rabbit ran fast.'"
];

export default function Practice() {
  const router = useRouter();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showNext, setShowNext] = useState(false);

  const currentPrompt = PROMPTS[currentPromptIndex];
  const progress = ((currentPromptIndex + 1) / PROMPTS.length) * 100;

  // Handle recording start
  const handleRecordStart = () => {
    setIsRecording(true);
    setFeedback(null);
    setShowNext(false);
  };

  // Handle recording stop and analysis
  const handleRecordStop = async (audioBlob) => {
    setIsRecording(false);
    
    if (!audioBlob) {
      // Recording failed or was cancelled
      return;
    }
    
    setIsAnalyzing(true);

    try {
      // Call backend API for transcription
      const result = await analyzeSpeech(audioBlob, currentPrompt);
      
      if (result.success) {
        // Store transcription separately for better display
        if (result.transcription) {
          setFeedback(`You said: "${result.transcription}"\n\n${result.feedback || "Great job!"}`);
        } else {
          setFeedback(result.feedback || "Great job!");
        }
        
        // Only increment score if transcription matches expected text
        if (result.matches === true) {
          setScore((prevScore) => prevScore + 1);
        }
        // If matches is false or null, don't increment score
        
        setShowNext(true);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setFeedback("Oops! Something went wrong. Let's try again!");
      setShowNext(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Move to next prompt
  const handleNext = () => {
    if (currentPromptIndex < PROMPTS.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
      setFeedback(null);
      setShowNext(false);
    } else {
      // All prompts completed - go to completion screen
      router.push({
        pathname: '/complete',
        query: { score } // Pass the actual number of correct answers
      });
    }
  };

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className={styles.progressText}>
          {currentPromptIndex + 1} of {PROMPTS.length}
        </p>
      </div>

      {/* Main Content */}
      <div className="card">
        <h2 className={styles.promptTitle}>Your Turn!</h2>
        
        <div className={styles.promptCard}>
          <p className={styles.promptText}>{currentPrompt}</p>
        </div>

        {/* Microphone Button */}
        <div className={styles.micContainer}>
          <MicButton
            isRecording={isRecording}
            onRecordStart={handleRecordStart}
            onRecordStop={handleRecordStop}
            disabled={isAnalyzing || showNext}
          />
        </div>

        {/* Status Messages */}
        {isRecording && (
          <div className={styles.status}>
            <p className={`${styles.statusText} pulse`}>🎤 Recording...</p>
          </div>
        )}

        {isAnalyzing && (
          <div className={styles.status}>
            <p className={styles.statusText}>
              <span className="spin">⏳</span> Analyzing...
            </p>
          </div>
        )}

        {/* Feedback Message */}
        {feedback && (
          <div className={styles.feedback}>
            <p className={styles.feedbackText}>{feedback}</p>
          </div>
        )}

        {/* Next Button */}
        {showNext && (
          <button 
            className="btn btn-success" 
            onClick={handleNext}
            style={{ marginTop: 'var(--space-8)' }}
          >
            {currentPromptIndex < PROMPTS.length - 1 ? 'Next' : 'Finish!'}
          </button>
        )}
      </div>
    </div>
  );
}

