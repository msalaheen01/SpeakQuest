import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/PracticeFocus.module.css';
import { getPracticeFocusSuggestions, formatSuggestionReason } from '../utils/practiceFocus';

/**
 * Practice Focus Component
 * Shows words that need extra attention
 * 
 * @param {object} props
 * @param {number} props.limit - Number of suggestions to show (default: 3)
 */
export default function PracticeFocus({ limit = 3 }) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState([]);
  
  useEffect(() => {
    const focusSuggestions = getPracticeFocusSuggestions(limit);
    setSuggestions(focusSuggestions);
  }, [limit]);
  
  if (suggestions.length === 0) {
    return null;
  }
  
  const handlePracticeWord = (word) => {
    // Navigate to practice mode with the specific word
    // For now, just navigate to practice - could be enhanced to start with specific word
    router.push('/practice');
  };
  
  return (
    <div className={styles.practiceFocusContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>🎯 Practice Focus</h3>
        <p className={styles.subtitle}>These {suggestions.length} word{suggestions.length !== 1 ? 's' : ''} need the most attention</p>
      </div>
      
      <div className={styles.suggestionsList}>
        {suggestions.map((suggestion, index) => (
          <div key={suggestion.word} className={styles.suggestionItem}>
            <div className={styles.suggestionHeader}>
              <span className={styles.suggestionWord}>{suggestion.word}</span>
              <span className={styles.suggestionBadge}>#{index + 1}</span>
            </div>
            <div className={styles.suggestionReason}>
              {formatSuggestionReason(suggestion.reasons)}
            </div>
            <div className={styles.suggestionStats}>
              <span>Accuracy: {suggestion.analytics.accuracyRate}%</span>
              {suggestion.analytics.avgClarity !== null && (
                <span>Clarity: {suggestion.analytics.avgClarity}%</span>
              )}
            </div>
            <button 
              className={styles.practiceButton}
              onClick={() => handlePracticeWord(suggestion.word)}
            >
              Practice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

