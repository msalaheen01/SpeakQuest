import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MicButton from '../components/MicButton';
import FeedbackCard from '../components/FeedbackCard';
import PastAttempts from '../components/PastAttempts';
import WhisperInterpretability from '../components/WhisperInterpretability';
import styles from '../styles/Review.module.css';
import { evaluatePronunciation } from '../api';
import { getReviewQueue, getWordStats, logAttempt, removeFromReview, getAttemptHistory } from '../utils/storage';

/**
 * Review Screen
 * Practice words that have been marked for review (2+ mistakes)
 * Same UI as practice mode but uses review queue
 */
export default function Review() {
  const router = useRouter();
  const [reviewQueue, setReviewQueue] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [wordStats, setWordStats] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [showNext, setShowNext] = useState(false);

  // Load review queue on mount
  useEffect(() => {
    const queue = getReviewQueue();
    setReviewQueue(queue);
    if (queue.length > 0) {
      setCurrentWord(queue[0]);
    }
  }, []);

  // Load word stats and history when word changes
  useEffect(() => {
    if (currentWord) {
      const stats = getWordStats(currentWord);
      setWordStats(stats);
      setAttemptHistory(getAttemptHistory(currentWord));
    }
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
      return;
    }
    
    setIsAnalyzing(true);

    try {
      const evaluationResult = await evaluatePronunciation(audioBlob, currentWord);
      
      // Store the full result for display
      setResult(evaluationResult);
      
      // Log the attempt with full result data
      logAttempt(currentWord, evaluationResult);
      
      // Update word stats and history
      const updatedStats = getWordStats(currentWord);
      setWordStats(updatedStats);
      setAttemptHistory(getAttemptHistory(currentWord));
      
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

  // Move to next word in review queue
  const handleNext = () => {
    if (currentWordIndex < reviewQueue.length - 1) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setCurrentWord(reviewQueue[nextIndex]);
      setResult(null);
      setShowNext(false);
    } else {
      // All review words completed - refresh queue or go back
      const updatedQueue = getReviewQueue();
      if (updatedQueue.length > 0) {
        // Still have words to review
        setReviewQueue(updatedQueue);
        setCurrentWordIndex(0);
        setCurrentWord(updatedQueue[0]);
        setResult(null);
        setShowNext(false);
      } else {
        // No more words to review - go back to home
        router.push('/');
      }
    }
  };

  // Go back to home
  const handleBackToHome = () => {
    router.push('/');
  };

  // If no words in review queue
  if (reviewQueue.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={handleBackToHome}
          >
            ← Home
          </button>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.wordCard} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className={styles.wordTitle}>Review Mode</div>
            <div className={styles.wordText} style={{ fontSize: 'var(--font-size-2xl)', margin: 'var(--space-6) 0' }}>
              No words need review
            </div>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)' }}>
              Keep practicing to identify words that need extra attention.
            </p>
            <button 
              className={styles.nextButton}
              onClick={handleBackToHome}
              style={{ marginTop: 'var(--space-8)', maxWidth: '300px' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentWordIndex + 1) / reviewQueue.length) * 100;

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
          <div className={styles.progressInfo}>
            Review: {currentWordIndex + 1} of {reviewQueue.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Layout with Sidebar */}
        <div className={styles.layout}>
        {/* Sidebar - Review Queue */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>Review Queue</div>
            <div className={styles.wordList}>
              {reviewQueue.map((word, index) => (
                <div
                  key={word}
                  className={`${styles.wordItem} ${index === currentWordIndex ? styles.wordItemActive : ''}`}
                  onClick={() => {
                    setCurrentWordIndex(index);
                    setCurrentWord(word);
                    setResult(null);
                    setShowNext(false);
                  }}
                >
                  <div className={styles.wordItemText}>{word}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Word Card */}
          <div className={styles.wordCard}>
            <div className={styles.wordTitle}>Current Word</div>
            <div className={styles.wordText}>{currentWord}</div>
            <div className={styles.wordHint}>Pronounce this word clearly</div>
          </div>

          {/* Past Attempts History */}
          <PastAttempts attemptHistory={attemptHistory} />

          {/* Microphone Card */}
          <div className={styles.micCard}>
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
              <div className={styles.statusMessage}>
                <span className={styles.statusIcon}>🎤</span>
                <span>Recording...</span>
              </div>
            )}

            {isAnalyzing && (
              <div className={styles.statusMessage}>
                <span className={styles.statusIcon}>⏳</span>
                <span>Analyzing with AI...</span>
              </div>
            )}
          </div>

          {/* Feedback Section */}
          {result && (
            <div className={styles.feedbackSection}>
              <FeedbackCard result={result} attemptHistory={attemptHistory} />
              <WhisperInterpretability result={result} expected={currentWord} />
            </div>
          )}

          {/* Next Button */}
          {showNext && (
            <button 
              className={styles.nextButton}
              onClick={handleNext}
            >
              {currentWordIndex < reviewQueue.length - 1 ? 'Next Word →' : 'Finish Review'}
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

