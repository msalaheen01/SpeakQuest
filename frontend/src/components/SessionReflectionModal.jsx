import { useState, useEffect } from 'react';
import styles from '../styles/SessionReflectionModal.module.css';
import { getLastNAttempts } from '../utils/metaFeedback';
import { getProgress } from '../utils/storage';

/**
 * Session Reflection Modal Component
 * Shows "Things Whisper Learned About You Today"
 * 
 * @param {object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onContinue - Optional callback for "Continue practicing" button
 */
export default function SessionReflectionModal({ isOpen, onClose, onContinue }) {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (isOpen) {
      generateInsights();
    }
  }, [isOpen]);

  const generateInsights = () => {
    const lastAttempts = getLastNAttempts(10);
    const generatedInsights = [];

    if (lastAttempts.length === 0) {
      setInsights(['Not enough data to generate insights yet. Keep practicing!']);
      return;
    }

    // Insight 1: Clarity trend
    const clarityScores = lastAttempts
      .filter(a => a.clarityScore !== null && a.clarityScore !== undefined)
      .map(a => a.clarityScore);
    
    if (clarityScores.length >= 3) {
      const firstHalf = clarityScores.slice(0, Math.ceil(clarityScores.length / 2));
      const secondHalf = clarityScores.slice(Math.ceil(clarityScores.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      const change = secondAvg - firstAvg;
      
      if (change > 5) {
        generatedInsights.push('Your clarity steadily improved over the session. Great work.');
      } else if (change < -5) {
        generatedInsights.push('Your clarity declined slightly — try speaking a bit louder or closer to the mic.');
      }
    }

    // Insight 2: Punctuation patterns (if we had transcription data, we'd check for punctuation)
    // For now, we'll use similarity patterns
    const nearCorrectCount = lastAttempts.filter(a => a.grade === 'near-correct').length;
    if (nearCorrectCount >= 3) {
      generatedInsights.push('Whisper often hears your speech as close but not exact — you\'re on the right track!');
    }

    // Insight 3: Ending consistency
    const incorrectCount = lastAttempts.filter(a => a.grade === 'incorrect').length;
    if (incorrectCount >= 3) {
      const avgSimilarity = lastAttempts
        .filter(a => a.similarityScore !== null)
        .map(a => a.similarityScore)
        .reduce((a, b) => a + b, 0) / lastAttempts.filter(a => a.similarityScore !== null).length;
      
      if (avgSimilarity < 70) {
        generatedInsights.push('Your ending sounds were inconsistent; AI confidence dipped at the end.');
      } else {
        generatedInsights.push('Some words need more practice — focus on clear pronunciation.');
      }
    }

    // Insight 4: High accuracy streak
    const recentCorrect = lastAttempts.slice(0, 5).filter(a => a.grade === 'correct').length;
    if (recentCorrect >= 4) {
      generatedInsights.push('You had a strong accuracy streak at the end of the session!');
    }

    // Insight 5: Consistency
    if (lastAttempts.length >= 5) {
      const grades = lastAttempts.map(a => a.grade);
      const uniqueGrades = new Set(grades);
      if (uniqueGrades.size === 1 && grades[0] === 'correct') {
        generatedInsights.push('Your pronunciation was consistently accurate throughout.');
      }
    }

    // Fill up to 3 insights
    while (generatedInsights.length < 3 && generatedInsights.length < lastAttempts.length) {
      if (generatedInsights.length === 0) {
        generatedInsights.push('Keep practicing to build more insights about your speech patterns.');
      } else {
        break;
      }
    }

    setInsights(generatedInsights.slice(0, 3));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Things Whisper Learned About You Today</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.content}>
          <ul className={styles.insightsList}>
            {insights.map((insight, index) => (
              <li key={index} className={styles.insightItem}>
                <span className={styles.insightNumber}>{index + 1}</span>
                <span className={styles.insightText}>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.footer}>
          {onContinue && (
            <button className={styles.continueButton} onClick={onContinue}>
              Continue Practicing
            </button>
          )}
          <button className={styles.closeButtonFooter} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

