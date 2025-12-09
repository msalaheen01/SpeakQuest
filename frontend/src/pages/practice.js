import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MicButton from '../components/MicButton';
import FeedbackCard from '../components/FeedbackCard';
import PastAttempts from '../components/PastAttempts';
import WhisperInterpretability from '../components/WhisperInterpretability';
import SessionSummary from '../components/SessionSummary';
import styles from '../styles/Practice.module.css';
import { evaluatePronunciation } from '../api';
import { WORD_LIST, getNextWord } from '../utils/words';
import { logAttempt, getWordStats, getAttemptHistory } from '../utils/storage';

/**
 * Practice Screen
 * Main interaction loop:
 * 1. Show target word
 * 2. User clicks mic to record
 * 3. Show "Analyzing..." state
 * 4. Display feedback and log attempt
 * 5. Move to next word
 */

export default function Practice() {
  const router = useRouter();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(WORD_LIST[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [wordStats, setWordStats] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [showNext, setShowNext] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [sessionWords, setSessionWords] = useState([]);
  const [showSessionSummary, setShowSessionSummary] = useState(false);

  // Load word stats and history when word changes
  useEffect(() => {
    const stats = getWordStats(currentWord);
    setWordStats(stats);
    setAttemptHistory(getAttemptHistory(currentWord));
  }, [currentWord]);

  // Handle recording start
  const handleRecordStart = () => {
    setIsRecording(true);
    setResult(null);
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
      // Use the enhanced evaluatePronunciation function
      const evaluationResult = await evaluatePronunciation(audioBlob, currentWord);
      
      // Store the full result for display
      setResult(evaluationResult);
      
      // Log the attempt with full result data
      logAttempt(currentWord, evaluationResult);
      
      // Update word stats and history
      const updatedStats = getWordStats(currentWord);
      setWordStats(updatedStats);
      setAttemptCount(updatedStats.attempts);
      setAttemptHistory(getAttemptHistory(currentWord));
      
      // Track session words
      if (!sessionWords.includes(currentWord)) {
        setSessionWords([...sessionWords, currentWord]);
      }
      
      setShowNext(true);
    } catch (error) {
      console.error('Analysis error:', error);
      setResult({
        transcription: '',
        expected: currentWord,
        grade: 'incorrect',
        clarityScore: null,
        similarityScore: 0,
        feedback: "Oops! Something went wrong. Let's try again!",
      });
      setShowNext(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Move to next word
  const handleNext = () => {
    const next = getNextWord(currentWordIndex);
    setCurrentWordIndex(next.index);
    setCurrentWord(next.word);
    setResult(null);
    setShowNext(false);
  };

  // Go back to home
  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        {/* Header */}
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={handleBackToHome}
          >
            ← Home
          </button>
        </div>

        {/* Word Card - Full Width */}
        <div className={styles.wordCard}>
          <div className={styles.wordTitle}>Current Word</div>
          <div className={styles.wordText}>{currentWord}</div>
          <div className={styles.wordHint}>Pronounce this word clearly</div>
        </div>

        {/* Microphone Button - Centered, Floating */}
        <div className={styles.micContainer}>
          <MicButton
            isRecording={isRecording}
            onRecordStart={handleRecordStart}
            onRecordStop={handleRecordStop}
            disabled={isAnalyzing || showNext}
          />
          
          {/* Status Messages */}
          {isRecording && (
            <div className={styles.statusMessage}>
              <span className={styles.statusIcon}>🎤</span>
              <span>Recording...</span>
            </div>
          )}

          {isAnalyzing && (
            <div className={styles.statusMessage}>
              <span className={styles.statusIcon}>⏳</span>
              <span>Analyzing...</span>
            </div>
          )}
        </div>

        {/* Feedback Card - Appears directly below mic after speaking */}
        {result && (
          <FeedbackCard result={result} attemptHistory={attemptHistory} />
        )}

        {/* Insights - Whisper Interpretability */}
        {result && (
          <WhisperInterpretability result={result} expected={currentWord} />
        )}

        {/* Past Attempts History - Full Width */}
        <PastAttempts attemptHistory={attemptHistory} />

        {/* Next Button - Full Width */}
        {showNext && (
          <button 
            className={styles.nextButton}
            onClick={handleNext}
          >
            Next Word →
          </button>
        )}
      </div>
    </div>
  );
}

