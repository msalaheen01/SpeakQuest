import { useState } from 'react';
import Card from './ui/Card';
import { Label, Body, Small } from './ui/Typography';
import { calculateWordAnalytics, getTrendIcon, getTrendLabel } from '../utils/analytics';
import { generateWordSummaryInsight } from '../utils/insights';
import styles from '../styles/PastAttempts.module.css';

/**
 * PastAttempts Component
 * Shows past attempt history for the current word
 * Enhanced with micro-analytics and trends
 * 
 * @param {object} props
 * @param {Array} props.attemptHistory - Array of attempt records
 */
export default function PastAttempts({ attemptHistory = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Don't render if no history
  if (!attemptHistory || attemptHistory.length === 0) {
    return null;
  }
  
  // Get recent attempts (last 5)
  const recentAttempts = attemptHistory.slice(-5).reverse();
  
  // Calculate comprehensive analytics
  const analytics = calculateWordAnalytics(attemptHistory);
  const { totalAttempts, accuracyRate, nearCorrectRate, avgClarity, avgSimilarity, 
          bestClarity, worstClarity, bestSimilarity, worstSimilarity, trend, improvementRate } = analytics;
  
  // Get summary insight
  const summaryInsight = generateWordSummaryInsight(attemptHistory);
  
  const correctCount = attemptHistory.filter(a => a.grade === 'correct').length;
  const nearCorrectCount = attemptHistory.filter(a => a.grade === 'near-correct').length;
  const incorrectCount = attemptHistory.filter(a => a.grade === 'incorrect').length;
  
  const getGradeIcon = (grade) => {
    if (grade === 'correct') return '✓';
    if (grade === 'near-correct') return '≈';
    return '✗';
  };
  
  const getGradeColor = (grade) => {
    if (grade === 'correct') return '#28a745';
    if (grade === 'near-correct') return '#ffc107';
    return '#dc3545';
  };
  
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };
  
  return (
    <Card className={styles.pastAttemptsContainer}>
      <div className={styles.cardHeader}>
        <button 
          className={styles.toggleButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <span className={styles.toggleIcon}>{isExpanded ? '▼' : '▶'}</span>
          <Label className={styles.toggleLabel}>Past Attempts</Label>
          <span className={styles.toggleCount}>({totalAttempts})</span>
        </button>
      </div>
      
      {isExpanded && (
        <div className={styles.cardBody}>
          {/* Summary Stats */}
          <div className={styles.summarySection}>
            <div className={styles.summaryItem}>
              <Label>Accuracy</Label>
              <div className={styles.summaryValue} style={{ color: accuracyRate >= 70 ? '#28a745' : accuracyRate >= 50 ? '#ffc107' : '#dc3545' }}>
                {accuracyRate}%
              </div>
            </div>
            <div className={styles.summaryItem}>
              <Label>Total Attempts</Label>
              <div className={styles.summaryValue}>{totalAttempts}</div>
            </div>
            {avgSimilarity !== null && (
              <div className={styles.summaryItem}>
                <Label>Avg Similarity</Label>
                <div className={styles.summaryValue}>{avgSimilarity}%</div>
              </div>
            )}
          </div>
          
          {/* Enhanced Analytics Section */}
          <div className={styles.analyticsSection}>
            {trend && (
              <div className={styles.analyticsItem}>
                <span className={styles.analyticsLabel}>Trend:</span>
                <span className={styles.analyticsValue}>
                  {getTrendIcon(trend)} {getTrendLabel(trend)}
                </span>
              </div>
            )}
            {avgClarity !== null && (
              <div className={styles.analyticsItem}>
                <span className={styles.analyticsLabel}>Avg Clarity:</span>
                <span className={styles.analyticsValue}>{avgClarity}%</span>
                {bestClarity !== null && worstClarity !== null && (
                  <span className={styles.analyticsRange}>
                    (Best: {bestClarity}%, Worst: {worstClarity}%)
                  </span>
                )}
              </div>
            )}
            {bestSimilarity !== null && worstSimilarity !== null && (
              <div className={styles.analyticsItem}>
                <span className={styles.analyticsLabel}>Similarity Range:</span>
                <span className={styles.analyticsValue}>
                  {worstSimilarity}% - {bestSimilarity}%
                </span>
              </div>
            )}
            {improvementRate !== null && (
              <div className={styles.analyticsItem}>
                <span className={styles.analyticsLabel}>Improvement:</span>
                <span className={styles.analyticsValue} style={{ color: improvementRate > 0 ? '#28a745' : '#dc3545' }}>
                  {improvementRate > 0 ? '+' : ''}{improvementRate}%
                </span>
              </div>
            )}
            {nearCorrectRate > 0 && (
              <div className={styles.analyticsItem}>
                <span className={styles.analyticsLabel}>Near Correct Rate:</span>
                <span className={styles.analyticsValue}>{nearCorrectRate}%</span>
              </div>
            )}
          </div>
          
          {/* Trend Indicator with Summary Insight */}
          {(trend || summaryInsight) && (
            <div className={styles.trendSection}>
              {trend && (
                <div className={styles.trendBadge} data-trend={trend}>
                  {getTrendIcon(trend)} {getTrendLabel(trend)}
                </div>
              )}
              {summaryInsight && (
                <div className={styles.insightMessage}>{summaryInsight}</div>
              )}
            </div>
          )}
          
          {/* Recent Attempts List */}
          <div className={styles.attemptsList}>
            <Label className={styles.attemptsHeader}>Recent Attempts</Label>
            <div className={styles.attemptsGrid}>
              {recentAttempts.map((attempt, index) => (
                <div key={index} className={styles.attemptItem}>
                  <div className={styles.attemptHeader}>
                    <span 
                      className={styles.attemptGrade}
                      style={{ color: getGradeColor(attempt.grade) }}
                    >
                      {getGradeIcon(attempt.grade)} {attempt.grade}
                    </span>
                    <Small className={styles.attemptTime}>{formatTimeAgo(attempt.timestamp)}</Small>
                  </div>
                  <div className={styles.attemptScores}>
                    {attempt.similarityScore !== null && (
                      <span className={styles.attemptScore}>
                        Similarity: {attempt.similarityScore}%
                      </span>
                    )}
                    {attempt.clarityScore !== null && (
                      <span className={styles.attemptScore}>
                        Clarity: {attempt.clarityScore}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Grade Breakdown */}
          <div className={styles.breakdownSection}>
            <div className={styles.breakdownItem} style={{ color: '#28a745' }}>
              <span className={styles.breakdownIcon}>✓</span>
              <span className={styles.breakdownLabel}>Correct:</span>
              <span className={styles.breakdownValue}>{correctCount}</span>
            </div>
            <div className={styles.breakdownItem} style={{ color: '#ffc107' }}>
              <span className={styles.breakdownIcon}>≈</span>
              <span className={styles.breakdownLabel}>Near:</span>
              <span className={styles.breakdownValue}>{nearCorrectCount}</span>
            </div>
            <div className={styles.breakdownItem} style={{ color: '#dc3545' }}>
              <span className={styles.breakdownIcon}>✗</span>
              <span className={styles.breakdownLabel}>Incorrect:</span>
              <span className={styles.breakdownValue}>{incorrectCount}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

