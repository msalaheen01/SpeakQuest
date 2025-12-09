import styles from '../styles/AudioHeatmap.module.css';

/**
 * Audio Heatmap Lite Component
 * Visualizes word-level timeline with confidence indicators
 * 
 * @param {object} result - Evaluation result with clarityScore and raw data
 * @param {string} expected - Expected word
 */
export default function AudioHeatmap({ result, expected }) {
  if (!result) return null;

  const { clarityScore, similarityScore, raw } = result;
  
  // If we have segment data from Whisper, use it
  const segments = raw?.segments || [];
  
  // Calculate confidence-based color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'var(--color-success)';
    if (confidence >= 0.6) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  // If we have segments, render them
  if (segments.length > 0) {
    const totalDuration = segments.reduce((sum, seg) => sum + (seg.end - seg.start), 0);
    
    return (
      <div className={styles.heatmapContainer}>
        <div className={styles.title}>Audio Timeline</div>
        <div className={styles.timeline}>
          {segments.map((segment, index) => {
            const width = ((segment.end - segment.start) / totalDuration) * 100;
            const confidence = segment.avg_logprob ? Math.exp(segment.avg_logprob) : 0.7;
            const color = getConfidenceColor(confidence);
            
            return (
              <div
                key={index}
                className={styles.segment}
                style={{
                  width: `${width}%`,
                  backgroundColor: color,
                  opacity: confidence
                }}
                title={`${(segment.end - segment.start).toFixed(2)}s | Confidence: ${(confidence * 100).toFixed(0)}%`}
              />
            );
          })}
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: 'var(--color-success)' }} />
            High Confidence
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: 'var(--color-warning)' }} />
            Medium Confidence
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: 'var(--color-error)' }} />
            Low Confidence
          </span>
        </div>
      </div>
    );
  }

  // Fallback: Approximate visualization based on clarity score
  // Split into beginning, middle, end segments
  const clarity = clarityScore ?? 70;
  const beginningConfidence = Math.min(1, (clarity + 10) / 100);
  const middleConfidence = Math.min(1, clarity / 100);
  const endConfidence = Math.max(0.3, (clarity - 10) / 100);

  return (
    <div className={styles.heatmapContainer}>
      <div className={styles.title}>Audio Timeline (Approximated)</div>
      <div className={styles.timeline}>
        <div
          className={styles.segment}
          style={{
            width: '33.33%',
            backgroundColor: getConfidenceColor(beginningConfidence),
            opacity: beginningConfidence
          }}
          title="Beginning | Confidence: High"
        />
        <div
          className={styles.segment}
          style={{
            width: '33.33%',
            backgroundColor: getConfidenceColor(middleConfidence),
            opacity: middleConfidence
          }}
          title="Middle | Confidence: Medium"
        />
        <div
          className={styles.segment}
          style={{
            width: '33.34%',
            backgroundColor: getConfidenceColor(endConfidence),
            opacity: endConfidence
          }}
          title="End | Confidence: Lower"
        />
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: 'var(--color-success)' }} />
          High Confidence
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: 'var(--color-warning)' }} />
          Medium Confidence
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: 'var(--color-error)' }} />
          Low Confidence
        </span>
      </div>
    </div>
  );
}

