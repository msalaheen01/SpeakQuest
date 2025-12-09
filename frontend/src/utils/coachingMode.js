/**
 * Coaching Mode Utilities
 * Manages user's preferred coaching style
 */

const COACHING_MODE_KEY = 'speakbetter_coaching_mode';
const DEFAULT_MODE = 'supportive';

export const COACHING_MODES = {
  SUPPORTIVE: 'supportive',
  ANALYTICAL: 'analytical',
  MINIMAL: 'minimal'
};

/**
 * Get current coaching mode from localStorage
 */
export function getCoachingMode() {
  try {
    const stored = localStorage.getItem(COACHING_MODE_KEY);
    return stored || DEFAULT_MODE;
  } catch (error) {
    console.error('Error reading coaching mode:', error);
    return DEFAULT_MODE;
  }
}

/**
 * Save coaching mode to localStorage
 */
export function setCoachingMode(mode) {
  try {
    if (Object.values(COACHING_MODES).includes(mode)) {
      localStorage.setItem(COACHING_MODE_KEY, mode);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving coaching mode:', error);
    return false;
  }
}

/**
 * Get feedback text based on coaching mode
 */
export function getFeedbackText(mode, grade, clarityScore, similarityScore) {
  const modeTexts = {
    [COACHING_MODES.SUPPORTIVE]: {
      correct: "Excellent! Your pronunciation was clear and accurate.",
      'near-correct': "Great progress! You're very close—just a small adjustment needed.",
      incorrect: "No worries! Every attempt helps you improve. Let's try again.",
      clarity: (score) => score >= 70 
        ? "Your speech clarity is strong!" 
        : score >= 50 
        ? "Your clarity is improving. Keep practicing!"
        : "Try speaking a bit louder or closer to the microphone.",
      similarity: (score) => score >= 90
        ? "Your pronunciation matches perfectly!"
        : score >= 70
        ? "You're getting closer to the target pronunciation!"
        : "Focus on the key sounds in this word."
    },
    [COACHING_MODES.ANALYTICAL]: {
      correct: `Grade: Correct | Clarity: ${clarityScore ?? 'N/A'}% | Similarity: ${similarityScore}%`,
      'near-correct': `Grade: Near-Correct | Clarity: ${clarityScore ?? 'N/A'}% | Similarity: ${similarityScore}% | Deviation: ${100 - similarityScore}%`,
      incorrect: `Grade: Incorrect | Clarity: ${clarityScore ?? 'N/A'}% | Similarity: ${similarityScore}% | Required: 90%+`,
      clarity: (score) => `Clarity Score: ${score}% (Threshold: 70% for optimal recognition)`,
      similarity: (score) => `Similarity Score: ${score}% (Target: 90%+)`
    },
    [COACHING_MODES.MINIMAL]: {
      correct: "✓",
      'near-correct': "≈",
      incorrect: "✗",
      clarity: (score) => `${score}%`,
      similarity: (score) => `${score}%`
    }
  };

  return modeTexts[mode] || modeTexts[DEFAULT_MODE];
}

