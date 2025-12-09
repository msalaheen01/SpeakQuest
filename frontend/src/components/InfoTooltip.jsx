import { useState } from 'react';
import styles from '../styles/InfoTooltip.module.css';

/**
 * InfoTooltip Component
 * Shows explanation tooltips for metrics
 * 
 * @param {object} props
 * @param {string} props.metric - Metric name ('clarity', 'similarity', 'grade')
 * @param {string} props.children - Content to show tooltip on
 */
export default function InfoTooltip({ metric, children }) {
  const [isVisible, setIsVisible] = useState(false);
  
  const explanations = {
    clarity: {
      title: 'Clarity Score',
      content: "Whisper's confidence in what you said. A low score may mean the audio was quiet, unclear, or had background noise. This doesn't always mean your pronunciation was wrong—it could indicate audio quality issues.",
    },
    similarity: {
      title: 'Similarity Score',
      content: 'How close Whisper\'s transcription is to the expected word. This measures how well your pronunciation matched the target word, accounting for minor differences like punctuation or slight variations.',
    },
    grade: {
      title: 'Grade',
      content: 'Based on similarity and clarity patterns. "Correct" means high similarity (≥90%). "Near Correct" means close (70-89%). "Incorrect" means the pronunciation needs more work (<70%).',
    },
  };
  
  const explanation = explanations[metric];
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
      <span className={styles.infoIcon}>ℹ️</span>
      {isVisible && (
        <div className={styles.tooltip}>
          <div className={styles.tooltipTitle}>{explanation.title}</div>
          <div className={styles.tooltipContent}>{explanation.content}</div>
        </div>
      )}
    </span>
  );
}

