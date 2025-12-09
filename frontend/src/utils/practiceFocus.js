/**
 * Practice Focus Suggestion Engine
 * Recommends words that need extra practice based on user data
 */

import { getProgress } from './storage';
import { calculateWordAnalytics } from './analytics';

/**
 * Get practice focus suggestions
 * Returns words that need the most attention
 * 
 * @param {number} limit - Maximum number of suggestions (default: 3)
 * @returns {Array} - Array of word suggestions with reasons
 */
export function getPracticeFocusSuggestions(limit = 3) {
  const progress = getProgress();
  const suggestions = [];
  
  for (const [word, wordData] of Object.entries(progress)) {
    const attemptHistory = wordData.attemptHistory || [];
    if (attemptHistory.length === 0) continue;
    
    const analytics = calculateWordAnalytics(attemptHistory);
    
    // Calculate priority score (lower = needs more attention)
    let priorityScore = 0;
    const reasons = [];
    
    // Low accuracy
    if (analytics.accuracyRate < 50) {
      priorityScore += (50 - analytics.accuracyRate) * 2;
      reasons.push('low accuracy');
    }
    
    // Low average clarity
    if (analytics.avgClarity !== null && analytics.avgClarity < 60) {
      priorityScore += (60 - analytics.avgClarity);
      reasons.push('low clarity');
    }
    
    // Low average similarity
    if (analytics.avgSimilarity !== null && analytics.avgSimilarity < 70) {
      priorityScore += (70 - analytics.avgSimilarity);
      reasons.push('low similarity');
    }
    
    // Declining trend
    if (analytics.trend === 'declining') {
      priorityScore += 30;
      reasons.push('declining performance');
    }
    
    // High incorrect attempts
    if (wordData.incorrectAttempts >= 3) {
      priorityScore += wordData.incorrectAttempts * 5;
      reasons.push('multiple mistakes');
    }
    
    // Low improvement rate
    if (analytics.improvementRate !== null && analytics.improvementRate < 0) {
      priorityScore += Math.abs(analytics.improvementRate);
      reasons.push('not improving');
    }
    
    if (priorityScore > 0) {
      suggestions.push({
        word,
        priorityScore,
        reasons: reasons.slice(0, 2), // Top 2 reasons
        analytics,
      });
    }
  }
  
  // Sort by priority (highest priority first)
  suggestions.sort((a, b) => b.priorityScore - a.priorityScore);
  
  return suggestions.slice(0, limit);
}

/**
 * Format suggestion reason for display
 * 
 * @param {Array} reasons - Array of reason strings
 * @returns {string} - Formatted reason text
 */
export function formatSuggestionReason(reasons) {
  if (reasons.length === 0) return 'needs practice';
  if (reasons.length === 1) return reasons[0];
  return `${reasons[0]} and ${reasons[1]}`;
}

