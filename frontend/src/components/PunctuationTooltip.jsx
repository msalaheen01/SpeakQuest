import { useState } from 'react';
import styles from '../styles/PunctuationTooltip.module.css';

/**
 * Punctuation Tooltip Component
 * Shows explanations for punctuation marks in Whisper transcriptions
 */
export default function PunctuationTooltip({ punctuation, children }) {
  const [isVisible, setIsVisible] = useState(false);
  
  const explanations = {
    '.': {
      title: 'Period (.)',
      content: 'AI detected sentence-ending intonation. Your pronunciation sounded like a complete, standalone phrase.'
    },
    ',': {
      title: 'Comma (,)',
      content: 'AI detected a slight pause. Your ending sounded incomplete or trailing.'
    },
    '-': {
      title: 'Hyphen (-)',
      content: 'AI detected a phonetic break or stutter-like gap. This suggests a pause or break inside the word.'
    },
    '?': {
      title: 'Question Mark (?)',
      content: 'AI detected rising intonation. Your pronunciation sounded like a question.'
    },
    '!': {
      title: 'Exclamation Mark (!)',
      content: 'AI detected strong emphasis or higher volume. Your pronunciation had extra energy or stress.'
    }
  };
  
  const explanation = explanations[punctuation];
  if (!explanation) return children;
  
  return (
    <span 
      className={styles.tooltipContainer}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <span className={styles.punctuationIcon}>{punctuation}</span>
      {isVisible && (
        <div className={styles.tooltip}>
          <div className={styles.tooltipTitle}>{explanation.title}</div>
          <div className={styles.tooltipContent}>{explanation.content}</div>
        </div>
      )}
    </span>
  );
}

