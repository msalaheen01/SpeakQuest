/**
 * Analytics and Trend Analysis Module
 * Computes micro-analytics and trends for word practice
 */

/**
 * Calculate word analytics from attempt history
 * 
 * @param {Array} attemptHistory - Array of attempt records
 * @returns {object} - Analytics object
 */
export function calculateWordAnalytics(attemptHistory) {
  if (!attemptHistory || attemptHistory.length === 0) {
    return {
      totalAttempts: 0,
      accuracyRate: 0,
      nearCorrectRate: 0,
      avgClarity: null,
      avgSimilarity: null,
      bestClarity: null,
      worstClarity: null,
      bestSimilarity: null,
      worstSimilarity: null,
      trend: null,
      improvementRate: null,
    };
  }
  
  const totalAttempts = attemptHistory.length;
  const correctCount = attemptHistory.filter(a => a.grade === 'correct').length;
  const nearCorrectCount = attemptHistory.filter(a => a.grade === 'near-correct').length;
  
  const accuracyRate = Math.round((correctCount / totalAttempts) * 100);
  const nearCorrectRate = Math.round((nearCorrectCount / totalAttempts) * 100);
  
  // Clarity analytics
  const clarityScores = attemptHistory
    .filter(a => a.clarityScore !== null)
    .map(a => a.clarityScore);
  
  const avgClarity = clarityScores.length > 0
    ? Math.round(clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length)
    : null;
  
  const bestClarity = clarityScores.length > 0 ? Math.max(...clarityScores) : null;
  const worstClarity = clarityScores.length > 0 ? Math.min(...clarityScores) : null;
  
  // Similarity analytics
  const similarityScores = attemptHistory
    .filter(a => a.similarityScore !== null)
    .map(a => a.similarityScore);
  
  const avgSimilarity = similarityScores.length > 0
    ? Math.round(similarityScores.reduce((a, b) => a + b, 0) / similarityScores.length)
    : null;
  
  const bestSimilarity = similarityScores.length > 0 ? Math.max(...similarityScores) : null;
  const worstSimilarity = similarityScores.length > 0 ? Math.min(...similarityScores) : null;
  
  // Trend analysis
  const trend = calculateTrend(attemptHistory);
  
  // Improvement rate (comparing first half to second half)
  const improvementRate = calculateImprovementRate(attemptHistory);
  
  return {
    totalAttempts,
    accuracyRate,
    nearCorrectRate,
    avgClarity,
    avgSimilarity,
    bestClarity,
    worstClarity,
    bestSimilarity,
    worstSimilarity,
    trend,
    improvementRate,
  };
}

/**
 * Calculate trend: improving, stable, or declining
 * 
 * @param {Array} attemptHistory - Attempt history
 * @returns {string|null} - 'improving', 'stable', 'declining', or null
 */
function calculateTrend(attemptHistory) {
  if (attemptHistory.length < 3) return null;
  
  const recentAttempts = attemptHistory.slice(-5); // Use last 5 for trend
  const grades = recentAttempts.map(a => {
    if (a.grade === 'correct') return 3;
    if (a.grade === 'near-correct') return 2;
    return 1;
  });
  
  if (grades.length < 3) return null;
  
  const firstHalf = grades.slice(0, Math.ceil(grades.length / 2));
  const secondHalf = grades.slice(Math.ceil(grades.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const diff = secondAvg - firstAvg;
  
  if (diff > 0.3) return 'improving';
  if (diff < -0.3) return 'declining';
  return 'stable';
}

/**
 * Calculate improvement rate percentage
 * 
 * @param {Array} attemptHistory - Attempt history
 * @returns {number|null} - Improvement percentage or null
 */
function calculateImprovementRate(attemptHistory) {
  if (attemptHistory.length < 4) return null;
  
  const midpoint = Math.floor(attemptHistory.length / 2);
  const firstHalf = attemptHistory.slice(0, midpoint);
  const secondHalf = attemptHistory.slice(midpoint);
  
  const firstAvgSimilarity = firstHalf
    .filter(a => a.similarityScore !== null)
    .map(a => a.similarityScore);
  
  const secondAvgSimilarity = secondHalf
    .filter(a => a.similarityScore !== null)
    .map(a => a.similarityScore);
  
  if (firstAvgSimilarity.length === 0 || secondAvgSimilarity.length === 0) {
    return null;
  }
  
  const firstAvg = firstAvgSimilarity.reduce((a, b) => a + b, 0) / firstAvgSimilarity.length;
  const secondAvg = secondAvgSimilarity.reduce((a, b) => a + b, 0) / secondAvgSimilarity.length;
  
  if (firstAvg === 0) return null;
  
  const improvement = ((secondAvg - firstAvg) / firstAvg) * 100;
  return Math.round(improvement);
}

/**
 * Get trend icon
 * 
 * @param {string} trend - Trend value
 * @returns {string} - Icon/emoji
 */
export function getTrendIcon(trend) {
  if (trend === 'improving') return '📈';
  if (trend === 'declining') return '📉';
  if (trend === 'stable') return '➡️';
  return '';
}

/**
 * Get trend label
 * 
 * @param {string} trend - Trend value
 * @returns {string} - Human-readable label
 */
export function getTrendLabel(trend) {
  if (trend === 'improving') return 'Improving';
  if (trend === 'declining') return 'Needs Attention';
  if (trend === 'stable') return 'Stable';
  return 'No Trend';
}

