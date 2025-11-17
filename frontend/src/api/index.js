/**
 * API Client for SpeakQuest
 * Handles communication with the backend Express server
 * 
 * Future: Can be extended to:
 * - Send actual audio files to backend
 * - Handle real-time streaming
 * - Integrate with Whisper API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Analyze speech input
 * Currently sends a placeholder request
 * 
 * Future: This would send actual audio data:
 * const formData = new FormData();
 * formData.append('audio', audioBlob, 'recording.webm');
 * return fetch(`${API_BASE_URL}/api/analyze`, {
 *   method: 'POST',
 *   body: formData
 * }).then(res => res.json());
 */
export async function analyzeSpeech() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Future: Include audio data, prompt text, etc.
        prompt: 'placeholder',
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Analysis failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Fallback response if backend is unavailable
    return {
      success: true,
      feedback: "Great job! Keep practicing!",
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

