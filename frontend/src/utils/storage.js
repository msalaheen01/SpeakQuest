/**
 * Local Storage Utility for SpeakBetter
 * Tracks word attempts, mistakes, and review queue
 */

import { WORD_LIST } from './words';

const STORAGE_KEY = 'speakbetter_progress';
const REVIEW_THRESHOLD = 2; // Words with 2+ mistakes go to review
const MASTERY_THRESHOLD = 2; // Remove from review after 2 consecutive correct attempts

/**
 * Get all stored progress data
 */
export function getProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading progress:', error);
    return {};
  }
}

/**
 * Save progress data
 */
export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

/**
 * Log an attempt for a word
 * Enhanced version that tracks clarity/similarity scores and grades
 * 
 * @param {string} word - The target word
 * @param {boolean|object} isCorrectOrResult - Either boolean (backward compat) or result object with:
 *   - isCorrect: boolean
 *   - grade: "correct" | "near-correct" | "incorrect"
 *   - clarityScore: number|null
 *   - similarityScore: number
 */
export function logAttempt(word, isCorrectOrResult) {
  const progress = getProgress();
  
  // Handle both old (boolean) and new (object) API
  let isCorrect, grade, clarityScore, similarityScore;
  
  if (typeof isCorrectOrResult === 'boolean') {
    // Backward compatibility: old API
    isCorrect = isCorrectOrResult;
    grade = isCorrect ? 'correct' : 'incorrect';
    clarityScore = null;
    similarityScore = null;
  } else {
    // New API with rich feedback
    isCorrect = isCorrectOrResult.isCorrect || false;
    grade = isCorrectOrResult.grade || (isCorrect ? 'correct' : 'incorrect');
    clarityScore = isCorrectOrResult.clarityScore ?? null;
    similarityScore = isCorrectOrResult.similarityScore ?? null;
  }
  
  if (!progress[word]) {
    progress[word] = {
      attempts: 0,
      incorrectAttempts: 0,
      lastAttempted: null,
      inReview: false,
      consecutiveCorrect: 0,
      clarityScores: [],
      similarityScores: [],
      lastGrade: null,
      attemptHistory: [], // Track individual attempts
    };
  }
  
  progress[word].attempts += 1;
  const attemptTimestamp = new Date().toISOString();
  progress[word].lastAttempted = attemptTimestamp;
  progress[word].lastGrade = grade;
  
  // Track scores if available
  if (clarityScore !== null) {
    progress[word].clarityScores = (progress[word].clarityScores || []).slice(-9); // Keep last 10
    progress[word].clarityScores.push(clarityScore);
  }
  if (similarityScore !== null) {
    progress[word].similarityScores = (progress[word].similarityScores || []).slice(-9); // Keep last 10
    progress[word].similarityScores.push(similarityScore);
  }
  
  // Track individual attempt history (keep last 20 attempts)
  const attemptRecord = {
    timestamp: attemptTimestamp,
    grade,
    clarityScore,
    similarityScore,
    isCorrect,
  };
  progress[word].attemptHistory = (progress[word].attemptHistory || []).slice(-19); // Keep last 20
  progress[word].attemptHistory.push(attemptRecord);
  
  // Determine if this counts as incorrect based on grade ONLY
  // Clarity score is informational only and should not affect review queue logic
  const isIncorrect = grade === 'incorrect';
  
  if (isIncorrect) {
    progress[word].incorrectAttempts += 1;
    progress[word].consecutiveCorrect = 0; // Reset consecutive correct counter
    
    // Add to review if mistake threshold reached
    if (progress[word].incorrectAttempts >= REVIEW_THRESHOLD) {
      progress[word].inReview = true;
    }
  } else {
    // Increment consecutive correct for both "correct" and "near-correct"
    // "Near-correct" is still progress and should count toward mastery
    if (grade === 'correct' || grade === 'near-correct') {
      progress[word].consecutiveCorrect = (progress[word].consecutiveCorrect || 0) + 1;
      
      // Remove from review if word has been mastered (2+ consecutive correct)
      // Only "correct" grades count toward mastery removal
      if (progress[word].inReview && grade === 'correct' && progress[word].consecutiveCorrect >= MASTERY_THRESHOLD) {
        progress[word].inReview = false;
      }
    } else {
      progress[word].consecutiveCorrect = 0;
    }
  }
  
  saveProgress(progress);
  return progress[word];
}

/**
 * Get word statistics
 * @param {string} word - The target word
 */
export function getWordStats(word) {
  const progress = getProgress();
  return progress[word] || {
    attempts: 0,
    incorrectAttempts: 0,
    lastAttempted: null,
    inReview: false,
    attemptHistory: [],
  };
}

/**
 * Get attempt history for a word
 * @param {string} word - The target word
 * @returns {Array} - Array of attempt records
 */
export function getAttemptHistory(word) {
  const stats = getWordStats(word);
  return stats.attemptHistory || [];
}

/**
 * Get all words that need review
 * Only includes words from the current word list
 */
export function getReviewQueue() {
  const progress = getProgress();
  const reviewWords = [];
  
  for (const [word, stats] of Object.entries(progress)) {
    // Only include words that are in the current WORD_LIST
    if (!WORD_LIST.includes(word)) {
      continue;
    }
    
    if (stats.inReview) {
      reviewWords.push({
        word,
        ...stats,
      });
    }
  }
  
  // Sort by most mistakes first, then by most recent attempt
  reviewWords.sort((a, b) => {
    if (b.incorrectAttempts !== a.incorrectAttempts) {
      return b.incorrectAttempts - a.incorrectAttempts;
    }
    return new Date(b.lastAttempted) - new Date(a.lastAttempted);
  });
  
  return reviewWords.map(item => item.word);
}

/**
 * Clear all progress (for testing/reset)
 */
export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing progress:', error);
  }
}

/**
 * Remove word from review queue (when user masters it)
 */
export function removeFromReview(word) {
  const progress = getProgress();
  if (progress[word]) {
    progress[word].inReview = false;
    saveProgress(progress);
  }
}

