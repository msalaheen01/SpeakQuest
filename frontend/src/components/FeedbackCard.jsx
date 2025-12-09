import { useState } from 'react';
import styles from '../styles/FeedbackCard.module.css';
import InfoTooltip from './InfoTooltip';
import { generateInsights } from '../utils/insights';

/**
 * FeedbackCard Component
 * Displays rich pronunciation feedback with grades, scores, and details
 * Adapts based on coaching mode
 * 
 * @param {object} result - Evaluation result with:
 *   - transcription: string
 *   - expected: string
 *   - grade: "correct" | "near-correct" | "incorrect"
 *   - clarityScore: number|null
 *   - similarityScore: number
 *   - topAlternative: string|null
 *   - feedback: string
 *   - raw: object|null (for advanced details)
 * @param {array} attemptHistory - History of past attempts
 */
export default function FeedbackCard({ result, attemptHistory = [] }) {
  const [showDetails, setShowDetails] = useState(false);
  
  if (!result) return null;
  
  const { transcription, expected, grade, clarityScore, similarityScore, topAlternative, feedback, raw } = result;
  
  // Generate insights
  const insights = generateInsights(result, attemptHistory);
  
  // Grade display configuration - Professional colors
  const gradeConfig = {
    'correct': {
      label: 'Correct',
      icon: '✓',
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-light)',
      borderColor: 'var(--color-success)',
    },
    'near-correct': {
      label: 'Near Correct',
      icon: '≈',
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-light)',
      borderColor: 'var(--color-warning)',
    },
    'incorrect': {
      label: 'Incorrect',
      icon: '✗',
      color: 'var(--color-error)',
      bgColor: 'var(--color-error-light)',
      borderColor: 'var(--color-error)',
    },
  };
  
  const config = gradeConfig[grade] || gradeConfig['incorrect'];
  
  return (
    <div className={styles.feedbackCard}>
      {/* Main Result Display */}
      <div className={styles.mainResult}>
        <div className={styles.transcriptionSection}>
          <div className={styles.label}>You said:</div>
          <div className={styles.value}>{transcription || '(no audio detected)'}</div>
        </div>
        
        <div className={styles.expectedSection}>
          <div className={styles.label}>Expected:</div>
          <div className={styles.value}>{expected}</div>
        </div>
        
        <div className={styles.gradeBadge} style={{ 
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          color: config.color,
        }}>
          <InfoTooltip metric="grade">
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </InfoTooltip>
        </div>
      </div>
      
      {/* Scores Display */}
      <div className={styles.scoresSection}>
        {clarityScore !== null && (
          <div className={styles.scoreItem}>
            <div className={styles.scoreLabel}>
              <InfoTooltip metric="clarity">Clarity Score</InfoTooltip>
            </div>
            <div className={styles.scoreBarContainer}>
              <div 
                className={styles.scoreBar}
                style={{ 
                  width: `${clarityScore}%`,
                  backgroundColor: clarityScore >= 70 ? 'var(--color-success)' : clarityScore >= 50 ? 'var(--color-warning)' : 'var(--color-error)',
                  color: clarityScore >= 70 ? 'var(--color-success)' : clarityScore >= 50 ? 'var(--color-warning)' : 'var(--color-error)'
                }}
              />
            </div>
            <div className={styles.scoreValue}>{clarityScore}/100</div>
          </div>
        )}
        
        <div className={styles.scoreItem}>
          <div className={styles.scoreLabel}>
            <InfoTooltip metric="similarity">Similarity Score</InfoTooltip>
          </div>
          <div className={styles.scoreBarContainer}>
            <div 
              className={styles.scoreBar}
                style={{ 
                  width: `${similarityScore}%`,
                  backgroundColor: similarityScore >= 90 ? 'var(--color-success)' : similarityScore >= 70 ? 'var(--color-warning)' : 'var(--color-error)',
                  color: similarityScore >= 90 ? 'var(--color-success)' : similarityScore >= 70 ? 'var(--color-warning)' : 'var(--color-error)'
                }}
            />
          </div>
          <div className={styles.scoreValue}>{similarityScore}/100</div>
        </div>
      </div>
      
      {/* Top Alternative (if available) */}
      {topAlternative && topAlternative.toLowerCase() !== expected.toLowerCase() && (
        <div className={styles.alternativeSection}>
          <div className={styles.label}>Whisper heard it as:</div>
          <div className={styles.alternativeValue}>{topAlternative}</div>
        </div>
      )}
      
      {/* Insights Section */}
      {insights.length > 0 && (
        <div className={styles.insightsSection}>
          <div className={styles.insightsTitle}>💡 Insights:</div>
          <ul className={styles.insightsList}>
            {insights.map((insight, index) => (
              <li key={index} className={styles.insightItem}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Feedback Message */}
      {feedback && (
        <div className={styles.feedbackMessage}>
          {feedback}
        </div>
      )}
      
      {/* Advanced Details (Collapsible) */}
      {raw && (
        <div className={styles.detailsSection}>
          <button 
            className={styles.detailsToggle}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details ▾' : 'Show Details ▾'}
          </button>
          
          {showDetails && (
            <div className={styles.detailsContent}>
              {raw.avgLogprob !== null && raw.avgLogprob !== undefined && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Average Log Probability:</span>
                  <span className={styles.detailValue}>{raw.avgLogprob.toFixed(4)}</span>
                </div>
              )}
              
              {raw.compression_ratio !== null && raw.compression_ratio !== undefined && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Compression Ratio:</span>
                  <span className={styles.detailValue}>{raw.compression_ratio.toFixed(2)}</span>
                </div>
              )}
              
              {raw.no_speech_prob !== null && raw.no_speech_prob !== undefined && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>No Speech Probability:</span>
                  <span className={styles.detailValue}>{(raw.no_speech_prob * 100).toFixed(1)}%</span>
                </div>
              )}
              
              {raw.language && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Detected Language:</span>
                  <span className={styles.detailValue}>{raw.language}</span>
                </div>
              )}
              
              {raw.duration && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Duration:</span>
                  <span className={styles.detailValue}>{raw.duration.toFixed(2)}s</span>
                </div>
              )}
              
              {raw.segments && raw.segments.length > 0 && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Segments:</span>
                  <span className={styles.detailValue}>{raw.segments.length}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

