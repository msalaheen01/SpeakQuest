/**
 * Meta Feedback Analytics
 * Aggregates data across all words for overview insights
 */

import { getProgress } from './storage';
import { WORD_LIST } from './words';

/**
 * Get all attempts across all words, sorted by timestamp
 */
export function getAllAttempts() {
  const progress = getProgress();
  const allAttempts = [];
  
  Object.keys(progress).forEach(word => {
    const wordData = progress[word];
    if (wordData.attemptHistory && wordData.attemptHistory.length > 0) {
      wordData.attemptHistory.forEach(attempt => {
        allAttempts.push({
          ...attempt,
          word,
          timestamp: attempt.timestamp || attempt.date || new Date().toISOString()
        });
      });
    }
  });
  
  // Sort by timestamp, most recent first
  return allAttempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Get last N attempts
 */
export function getLastNAttempts(n = 10) {
  return getAllAttempts().slice(0, n);
}

/**
 * Calculate clarity trend from last 10 attempts
 */
export function getClarityTrend() {
  const lastAttempts = getLastNAttempts(10);
  const clarityScores = lastAttempts
    .filter(a => a.clarityScore !== null && a.clarityScore !== undefined)
    .map(a => a.clarityScore);
  
  if (clarityScores.length < 2) {
    return { trend: 'insufficient', change: 0, message: 'Not enough data' };
  }
  
  const firstHalf = clarityScores.slice(0, Math.ceil(clarityScores.length / 2));
  const secondHalf = clarityScores.slice(Math.ceil(clarityScores.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const change = secondAvg - firstAvg;
  
  if (change > 5) {
    return { trend: 'improving', change: Math.round(change), message: `Clarity improved by ${Math.round(change)}%` };
  } else if (change < -5) {
    return { trend: 'declining', change: Math.round(change), message: `Clarity declined by ${Math.abs(Math.round(change))}%` };
  } else {
    return { trend: 'stable', change: Math.round(change), message: 'Clarity remains stable' };
  }
}

/**
 * Calculate similarity trend from last 10 attempts
 */
export function getSimilarityTrend() {
  const lastAttempts = getLastNAttempts(10);
  const similarityScores = lastAttempts
    .filter(a => a.similarityScore !== null && a.similarityScore !== undefined)
    .map(a => a.similarityScore);
  
  if (similarityScores.length < 2) {
    return { trend: 'insufficient', change: 0, message: 'Not enough data' };
  }
  
  const firstHalf = similarityScores.slice(0, Math.ceil(similarityScores.length / 2));
  const secondHalf = similarityScores.slice(Math.ceil(similarityScores.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const change = secondAvg - firstAvg;
  
  if (change > 5) {
    return { trend: 'improving', change: Math.round(change), message: `Similarity improved by ${Math.round(change)}%` };
  } else if (change < -5) {
    return { trend: 'declining', change: Math.round(change), message: `Similarity declined by ${Math.abs(Math.round(change))}%` };
  } else {
    return { trend: 'stable', change: Math.round(change), message: 'Similarity remains stable' };
  }
}

/**
 * Get most common misinterpretation pattern
 * Only includes words from the current word list
 */
export function getMostCommonMisinterpretation() {
  const progress = getProgress();
  const wordMistakes = [];
  
  Object.keys(progress).forEach(word => {
    // Only include words that are in the current WORD_LIST
    if (!WORD_LIST.includes(word)) {
      return;
    }
    
    const wordData = progress[word];
    if (wordData.incorrectAttempts > 0) {
      wordMistakes.push({
        word,
        incorrectRate: wordData.incorrectAttempts / (wordData.attempts || 1),
        incorrectCount: wordData.incorrectAttempts
      });
    }
  });
  
  if (wordMistakes.length === 0) {
    return { word: null, rate: 0, message: 'No common mistakes detected' };
  }
  
  wordMistakes.sort((a, b) => b.incorrectRate - a.incorrectRate);
  const top = wordMistakes[0];
  
  return {
    word: top.word,
    rate: Math.round(top.incorrectRate * 100),
    count: top.incorrectCount,
    message: `"${top.word}" has ${top.incorrectCount} mistake${top.incorrectCount !== 1 ? 's' : ''}`
  };
}

/**
 * Get AI pattern summary
 */
export function getAIPatternSummary() {
  const lastAttempts = getLastNAttempts(20);
  let punctuationCount = 0;
  let totalAttempts = lastAttempts.length;
  
  // Check for punctuation in transcriptions (would need to store transcription in attempt history)
  // For now, we'll use a simplified approach based on available data
  
  const patterns = [];
  
  if (totalAttempts > 0) {
    const incorrectRate = lastAttempts.filter(a => a.grade === 'incorrect').length / totalAttempts;
    if (incorrectRate > 0.3) {
      patterns.push('AI frequently misinterprets your pronunciation');
    }
    
    const nearCorrectRate = lastAttempts.filter(a => a.grade === 'near-correct').length / totalAttempts;
    if (nearCorrectRate > 0.4) {
      patterns.push('AI often hears your speech as close but not exact');
    }
    
    const clarityScores = lastAttempts
      .filter(a => a.clarityScore !== null)
      .map(a => a.clarityScore);
    if (clarityScores.length > 0) {
      const avgClarity = clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length;
      if (avgClarity < 60) {
        patterns.push('AI detects lower clarity in your speech');
      }
    }
  }
  
  if (patterns.length === 0) {
    return 'AI patterns are consistent with your speech';
  }
  
  return patterns.join('; ');
}

