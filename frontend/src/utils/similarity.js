/**
 * Text Similarity Utilities
 * Computes similarity scores between transcriptions and target words
 */

/**
 * Normalize text for comparison (lowercase, remove punctuation, trim)
 * Handles Whisper artifacts like trailing punctuation, extra spaces, etc.
 */
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove all punctuation
    .replace(/\s+/g, ' ')    // Normalize whitespace (multiple spaces to single)
    .trim();
}

/**
 * Compute Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Edit distance
 */
function levenshteinDistance(str1, str2) {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;
  
  const matrix = [];
  
  // Initialize matrix
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2[i - 1] === s1[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1       // deletion
        );
      }
    }
  }
  
  return matrix[s2.length][s1.length];
}

/**
 * Compute similarity score (0-100) between two strings
 * Uses Levenshtein distance normalized by string length
 * 
 * @param {string} transcription - The transcribed text
 * @param {string} target - The target word/phrase
 * @returns {number} - Similarity score from 0-100
 */
export function computeSimilarityScore(transcription, target) {
  if (!transcription || !target) return 0;
  
  const normalizedTrans = normalizeText(transcription);
  const normalizedTarget = normalizeText(target);
  
  // Exact match
  if (normalizedTrans === normalizedTarget) {
    return 100;
  }
  
  // Compute Levenshtein distance
  const distance = levenshteinDistance(normalizedTrans, normalizedTarget);
  const maxLength = Math.max(normalizedTrans.length, normalizedTarget.length);
  
  if (maxLength === 0) return 100;
  
  // Convert distance to similarity (0-100)
  const similarity = ((maxLength - distance) / maxLength) * 100;
  
  // Boost score if one string contains the other (for partial matches)
  if (normalizedTrans.includes(normalizedTarget) || normalizedTarget.includes(normalizedTrans)) {
    return Math.min(100, similarity + 10);
  }
  
  return Math.max(0, Math.round(similarity));
}

/**
 * Check if transcription is a close match (for word-level prompts)
 * @param {string} transcription - The transcribed text
 * @param {string} target - The target word
 * @returns {boolean}
 */
export function isCloseMatch(transcription, target) {
  const score = computeSimilarityScore(transcription, target);
  return score >= 70 && score < 90;
}

