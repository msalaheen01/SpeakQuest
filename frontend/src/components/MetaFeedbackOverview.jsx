import { useEffect, useState } from 'react';
import styles from '../styles/MetaFeedbackOverview.module.css';
import {
  getClarityTrend,
  getSimilarityTrend,
  getMostCommonMisinterpretation,
  getAIPatternSummary
} from '../utils/metaFeedback';

/**
 * Meta Feedback Overview Component
 * Displays long-term stats and trends in card format
 */
export default function MetaFeedbackOverview() {
  const [clarityTrend, setClarityTrend] = useState(null);
  const [similarityTrend, setSimilarityTrend] = useState(null);
  const [misinterpretation, setMisinterpretation] = useState(null);
  const [aiPattern, setAiPattern] = useState(null);

  useEffect(() => {
    setClarityTrend(getClarityTrend());
    setSimilarityTrend(getSimilarityTrend());
    setMisinterpretation(getMostCommonMisinterpretation());
    setAiPattern(getAIPatternSummary());
  }, []);

  // Don't render if no data
  if (!clarityTrend && !similarityTrend && !misinterpretation && !aiPattern) {
    return null;
  }

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return '↑';
    if (trend === 'declining') return '↓';
    if (trend === 'stable') return '→';
    return '—';
  };

  const getTrendColor = (trend) => {
    if (trend === 'improving') return 'var(--color-success)';
    if (trend === 'declining') return 'var(--color-error)';
    return 'var(--color-text-secondary)';
  };

  return (
    <div className={styles.overviewContainer}>
      <h3 className={styles.sectionTitle}>Meta-Feedback Overview</h3>
      <div className={styles.cardsGrid}>
        {/* Most Common Misinterpretation */}
        {misinterpretation && misinterpretation.word && (
          <div className={styles.card}>
            <div className={styles.cardIcon}>🎯</div>
            <div className={styles.cardTitle}>Most Common Misinterpretation</div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>{misinterpretation.word}</div>
              <div className={styles.cardDetail}>{misinterpretation.message}</div>
            </div>
          </div>
        )}

        {/* Clarity Trend */}
        {clarityTrend && clarityTrend.trend !== 'insufficient' && (
          <div className={styles.card}>
            <div className={styles.cardIcon}>📊</div>
            <div className={styles.cardTitle}>Clarity Trend</div>
            <div className={styles.cardContent}>
              <div 
                className={styles.cardValue}
                style={{ color: getTrendColor(clarityTrend.trend) }}
              >
                {getTrendIcon(clarityTrend.trend)} {clarityTrend.message}
              </div>
              <div className={styles.cardDetail}>Last 10 attempts</div>
            </div>
          </div>
        )}

        {/* Similarity Trend */}
        {similarityTrend && similarityTrend.trend !== 'insufficient' && (
          <div className={styles.card}>
            <div className={styles.cardIcon}>📈</div>
            <div className={styles.cardTitle}>Similarity Trend</div>
            <div className={styles.cardContent}>
              <div 
                className={styles.cardValue}
                style={{ color: getTrendColor(similarityTrend.trend) }}
              >
                {getTrendIcon(similarityTrend.trend)} {similarityTrend.message}
              </div>
              <div className={styles.cardDetail}>Last 10 attempts</div>
            </div>
          </div>
        )}

        {/* AI Pattern Summary */}
        {aiPattern && (
          <div className={styles.card}>
            <div className={styles.cardIcon}>🤖</div>
            <div className={styles.cardTitle}>AI Pattern Summary</div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>{aiPattern}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

