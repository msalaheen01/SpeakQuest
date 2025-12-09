import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/SessionSummary.module.css';
import { calculateWordAnalytics, getTrendIcon, getTrendLabel } from '../utils/analytics';
import { getProgress } from '../utils/storage';

/**
 * Session Summary Component
 * Shows reflection panel after practice session
 * 
 * @param {object} props
 * @param {Array} props.sessionWords - Words practiced in this session
 * @param {Function} props.onClose - Callback when summary is closed
 */
export default function SessionSummary({ sessionWords = [], onClose }) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible || !sessionWords || sessionWords.length === 0) {
    return null;
  }
  
  const progress = getProgress();
  
  // Calculate session statistics
  const sessionStats = sessionWords.map(word => {
    const wordData = progress[word] || {};
    const attemptHistory = wordData.attemptHistory || [];
    const analytics = calculateWordAnalytics(attemptHistory);
    return { word, ...analytics };
  });
  
  // Find words that improved most
  const improvedWords = sessionStats
    .filter(s => s.improvementRate !== null && s.improvementRate > 0)
    .sort((a, b) => b.improvementRate - a.improvementRate)
    .slice(0, 3);
  
  // Find words that need attention
  const needsAttention = sessionStats
    .filter(s => s.accuracyRate < 50 || s.trend === 'declining')
    .sort((a, b) => a.accuracyRate - b.accuracyRate)
    .slice(0, 3);
  
  // Calculate overall session stats
  const totalAttempts = sessionStats.reduce((sum, s) => sum + s.totalAttempts, 0);
  const avgAccuracy = sessionStats.length > 0
    ? Math.round(sessionStats.reduce((sum, s) => sum + s.accuracyRate, 0) / sessionStats.length)
    : 0;
  const avgClarity = sessionStats
    .filter(s => s.avgClarity !== null)
    .map(s => s.avgClarity);
  const overallAvgClarity = avgClarity.length > 0
    ? Math.round(avgClarity.reduce((a, b) => a + b, 0) / avgClarity.length)
    : null;
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.summaryCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Session Summary</h2>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>
        
        <div className={styles.content}>
          {/* Overall Stats */}
          <div className={styles.overallSection}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Words Practiced</div>
              <div className={styles.statValue}>{sessionWords.length}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Total Attempts</div>
              <div className={styles.statValue}>{totalAttempts}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Avg Accuracy</div>
              <div className={styles.statValue} style={{ color: avgAccuracy >= 70 ? '#28a745' : avgAccuracy >= 50 ? '#ffc107' : '#dc3545' }}>
                {avgAccuracy}%
              </div>
            </div>
            {overallAvgClarity !== null && (
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Avg Clarity</div>
                <div className={styles.statValue}>{overallAvgClarity}%</div>
              </div>
            )}
          </div>
          
          {/* Improved Words */}
          {improvedWords.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>📈 Most Improved</h3>
              <div className={styles.wordList}>
                {improvedWords.map(({ word, improvementRate }) => (
                  <div key={word} className={styles.wordItem}>
                    <span className={styles.wordName}>{word}</span>
                    <span className={styles.wordStat} style={{ color: '#28a745' }}>
                      +{improvementRate}% improvement
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Needs Attention */}
          {needsAttention.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>🎯 Needs Attention</h3>
              <div className={styles.wordList}>
                {needsAttention.map(({ word, accuracyRate, trend }) => (
                  <div key={word} className={styles.wordItem}>
                    <span className={styles.wordName}>{word}</span>
                    <div className={styles.wordStats}>
                      <span className={styles.wordStat}>Accuracy: {accuracyRate}%</span>
                      {trend && (
                        <span className={styles.wordStat}>
                          {getTrendIcon(trend)} {getTrendLabel(trend)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Encouraging Message */}
          <div className={styles.encouragementSection}>
            {avgAccuracy >= 70 && (
              <p className={styles.encouragementText}>
                🎉 Great session! You're doing well with your pronunciation practice.
              </p>
            )}
            {avgAccuracy >= 50 && avgAccuracy < 70 && (
              <p className={styles.encouragementText}>
                💪 Good progress! Keep practicing to improve your accuracy.
              </p>
            )}
            {avgAccuracy < 50 && (
              <p className={styles.encouragementText}>
                🌱 Every practice session helps! Focus on the words that need attention.
              </p>
            )}
            {overallAvgClarity !== null && overallAvgClarity < 60 && (
              <p className={styles.encouragementText}>
                💡 Tip: Try speaking closer to the microphone for better audio clarity.
              </p>
            )}
          </div>
        </div>
        
        <div className={styles.footer}>
          <button className={styles.primaryButton} onClick={handleClose}>
            Continue Practicing
          </button>
        </div>
      </div>
    </div>
  );
}

