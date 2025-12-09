/**
 * Insight Generation Module
 * Generates human-friendly explanations for Whisper's behavior
 * Helps users understand why their pronunciation was evaluated a certain way
 */

/**
 * Generate insights based on Whisper metadata and evaluation results
 * 
 * @param {object} result - Evaluation result with grade, scores, metadata
 * @param {Array} attemptHistory - Previous attempts for this word
 * @returns {Array<string>} - Array of insight messages
 */
export function generateInsights(result, attemptHistory = []) {
  const insights = [];
  const { grade, clarityScore, similarityScore, transcription, expected, raw } = result;
  
  // Insight 1: Clarity-based insights
  if (clarityScore !== null) {
    if (clarityScore < 50) {
      insights.push("Your audio was unclear; try speaking louder or closer to the mic.");
    } else if (clarityScore < 70 && similarityScore >= 70) {
      insights.push("Your pronunciation was close, but the audio clarity was low. Try speaking more clearly or reducing background noise.");
    }
  }
  
  // Insight 2: Similarity-based insights
  if (similarityScore >= 70 && similarityScore < 90) {
    const normalizedTrans = transcription.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const normalizedExpected = expected.toLowerCase().replace(/[^\w\s]/g, '').trim();
    
    // Check if transcription is shorter (truncated)
    if (normalizedTrans.length < normalizedExpected.length - 2) {
      insights.push("The final part of the word was unclear, so Whisper heard a shorter version.");
    } else if (normalizedTrans.length > normalizedExpected.length + 2) {
      insights.push("Whisper heard extra sounds. Try pronouncing the word more precisely.");
    } else {
      insights.push("Close! The pronunciation was similar but not quite exact. Keep practicing!");
    }
  } else if (similarityScore < 70) {
    insights.push("Whisper heard something different from the expected word. Try focusing on the key sounds.");
  }
  
  // Insight 3: High similarity but low clarity
  if (similarityScore >= 90 && clarityScore !== null && clarityScore < 70) {
    insights.push("Your pronunciation was correct, but the audio quality was low. Try speaking closer to the microphone.");
  }
  
  // Insight 4: Whisper metadata insights
  if (raw) {
    // High no_speech_prob indicates unclear audio
    if (raw.no_speech_prob !== null && raw.no_speech_prob > 0.3) {
      insights.push("Whisper detected unclear speech. Make sure you're speaking clearly into the microphone.");
    }
    
    // High compression_ratio can indicate noisy audio
    if (raw.compression_ratio !== null && raw.compression_ratio > 2.5) {
      insights.push("Background noise may have affected the recording. Try a quieter environment.");
    }
  }
  
  // Insight 5: Pattern-based insights from history
  if (attemptHistory.length >= 3) {
    const recentAttempts = attemptHistory.slice(-3);
    const recentClarity = recentAttempts
      .filter(a => a.clarityScore !== null)
      .map(a => a.clarityScore);
    const recentSimilarity = recentAttempts
      .filter(a => a.similarityScore !== null)
      .map(a => a.similarityScore);
    
    // Declining clarity trend
    if (recentClarity.length >= 2) {
      const clarityTrend = recentClarity[recentClarity.length - 1] - recentClarity[0];
      if (clarityTrend < -10) {
        insights.push("Your audio clarity has been decreasing. Check your microphone or speaking distance.");
      }
    }
    
    // Repeated low similarity
    const lowSimilarityCount = recentSimilarity.filter(s => s < 70).length;
    if (lowSimilarityCount >= 2) {
      insights.push("You've had difficulty with this word recently. Try breaking it down into syllables.");
    }
    
    // Repeated low clarity
    const lowClarityCount = recentClarity.filter(c => c < 50).length;
    if (lowClarityCount >= 2) {
      insights.push("Your audio has been consistently unclear. Try adjusting your microphone or speaking environment.");
    }
  }
  
  // Insight 6: Grade-specific encouragement
  if (grade === 'correct') {
    if (attemptHistory.length > 1) {
      const previousGrade = attemptHistory[attemptHistory.length - 2]?.grade;
      if (previousGrade !== 'correct') {
        insights.push("Great improvement! You got it right this time.");
      }
    }
  } else if (grade === 'near-correct') {
    insights.push("You're very close! Small adjustments will get you there.");
  }
  
  // Remove duplicates and limit to 3 most relevant insights
  const uniqueInsights = [...new Set(insights)];
  return uniqueInsights.slice(0, 3);
}

/**
 * Generate a summary insight for a word based on all attempts
 * 
 * @param {Array} attemptHistory - All attempts for the word
 * @returns {string|null} - Summary insight or null
 */
export function generateWordSummaryInsight(attemptHistory) {
  if (!attemptHistory || attemptHistory.length === 0) return null;
  
  const correctCount = attemptHistory.filter(a => a.grade === 'correct').length;
  const totalAttempts = attemptHistory.length;
  const accuracyRate = (correctCount / totalAttempts) * 100;
  
  const recentAttempts = attemptHistory.slice(-3);
  const recentGrades = recentAttempts.map(a => a.grade);
  const allCorrect = recentGrades.every(g => g === 'correct');
  const improving = recentGrades[recentGrades.length - 1] === 'correct' && 
                    recentGrades[0] !== 'correct';
  
  if (allCorrect && totalAttempts >= 3) {
    return "You've mastered this word! Great consistency.";
  }
  
  if (improving) {
    return "You're improving with this word! Keep it up.";
  }
  
  if (accuracyRate < 30) {
    return "This word is challenging. Focus on the key sounds.";
  }
  
  if (accuracyRate >= 30 && accuracyRate < 60) {
    return "You're making progress. A bit more practice will help.";
  }
  
  return null;
}

