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

