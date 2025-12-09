/**
 * API Client for SpeakBetter
 * Handles communication with the backend Express server
 * Wraps Whisper API transcription with evaluation logic
 */

import { computeSimilarityScore } from '../utils/similarity';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Analyze speech input and transcribe audio
 * Sends audio file to backend for transcription
 */
export async function analyzeSpeech(audioBlob, prompt = '') {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    if (prompt) {
      formData.append('prompt', prompt);
    }

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Analysis failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Fallback response if backend is unavailable
    return {
      success: false,
      feedback: "Oops! Could not connect to the server. Please try again.",
      transcription: null,
      matches: false,
    };
  }
}

/**
 * Normalize log probability to clarity score (0-100)
 * Whisper logprobs are typically negative (e.g., -0.5 to -0.1)
 * Higher (less negative) = more confident
 * 
 * @param {number} avgLogprob - Average log probability from Whisper
 * @returns {number} - Clarity score 0-100
 */
function computeClarityScore(avgLogprob) {
  if (avgLogprob === null || avgLogprob === undefined) {
    return null; // No clarity data available
  }
  
  // Whisper logprobs are typically in range [-1, 0]
  // Normalize to [0, 100] where -0.1 (very confident) = 100, -1.0 (uncertain) = 0
  // Using a sigmoid-like transformation for better distribution
  const normalized = Math.max(0, Math.min(1, (avgLogprob + 1) / 0.9));
  return Math.round(normalized * 100);
}

/**
 * Determine grade based on similarity score ONLY
 * Clarity score is for feedback only, not for correctness determination
 * 
 * @param {number} similarityScore - Similarity score 0-100
 * @returns {string} - "correct" | "near-correct" | "incorrect"
 */
function determineGrade(similarityScore) {
  // Grade based ONLY on similarity score
  // Clarity score is informational only and should not affect correctness
  if (similarityScore >= 90) {
    return 'correct';
  } else if (similarityScore >= 70) {
    return 'near-correct';
  } else {
    return 'incorrect';
  }
}

/**
 * Evaluate pronunciation of a target word
 * Enhanced version with clarity scores, similarity scores, and grading
 * 
 * @param {Blob} audioBlob - The recorded audio blob
 * @param {string} targetWord - The target word to compare against
 * @returns {Promise<{
 *   transcription: string,
 *   isCorrect: boolean,
 *   clarityScore: number|null,
 *   similarityScore: number,
 *   grade: string,
 *   topAlternative: string|null,
 *   expected: string,
 *   feedback: string,
 *   raw: object|null
 * }>}
 */
export async function evaluatePronunciation(audioBlob, targetWord) {
  // Create prompt in the format the backend expects
  const prompt = `Say the word: '${targetWord}'`;
  
  try {
    const result = await analyzeSpeech(audioBlob, prompt);
    
    const transcription = result.transcription || '';
    const metadata = result.metadata || null;
    
    // Compute clarity score from Whisper metadata
    const avgLogprob = metadata?.avgLogprob ?? null;
    const clarityScore = computeClarityScore(avgLogprob);
    
    // Compute similarity score (this already normalizes text properly)
    const similarityScore = computeSimilarityScore(transcription, targetWord);
    
    // Determine grade based ONLY on similarity score
    const grade = determineGrade(similarityScore);
    
    // Determine isCorrect based on grade (for backward compatibility)
    const isCorrect = grade === 'correct';
    
    // Extract top alternative if available
    // Show alternative only if transcription is meaningfully different from target
    let topAlternative = null;
    if (transcription && similarityScore < 90) {
      // Only show alternative if it's not a correct match
      // Normalize both for comparison
      const normalizedTrans = transcription.toLowerCase().replace(/[^\w\s]/g, '').trim();
      const normalizedTarget = targetWord.toLowerCase().replace(/[^\w\s]/g, '').trim();
      if (normalizedTrans !== normalizedTarget) {
        topAlternative = transcription;
      }
    }
    
    // Generate feedback message based on grade
    let feedback = '';
    if (grade === 'correct') {
      feedback = "Excellent pronunciation!";
    } else if (grade === 'near-correct') {
      feedback = "Close! Keep practicing to perfect it.";
    } else {
      feedback = "Not quite right. Try again!";
    }
    
    return {
      transcription,
      isCorrect,
      clarityScore,
      similarityScore,
      grade,
      topAlternative,
      expected: result.expectedText || targetWord,
      feedback: result.feedback || feedback,
      raw: metadata, // Include raw metadata for debugging
    };
  } catch (error) {
    console.error('Evaluation error:', error);
    return {
      transcription: '',
      isCorrect: false,
      clarityScore: null,
      similarityScore: 0,
      grade: 'incorrect',
      topAlternative: null,
      expected: targetWord,
      feedback: "Oops! Something went wrong during evaluation.",
      raw: null,
    };
  }
}

/**
 * Health check for backend
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { status: 'error' };
  }
}

