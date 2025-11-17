/**
 * SpeakQuest Backend Server
 * Simple Express API for speech analysis (simulated)
 * 
 * Future: This can be extended to integrate with:
 * - OpenAI Whisper API for real speech-to-text
 * - Custom ML models for speech analysis
 * - Database for storing user progress
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow frontend to make requests
app.use(express.json());

/**
 * Simulated speech analysis endpoint
 * 
 * In production, this would:
 * 1. Receive audio file or audio data
 * 2. Send to Whisper API for transcription
 * 3. Analyze transcription against target prompt
 * 4. Return detailed feedback
 */
app.post('/api/analyze', (req, res) => {
  // Simulate processing delay
  setTimeout(() => {
    // Simulated feedback - in real app, this would analyze the speech
    const feedbacks = [
      "Great job! You said that perfectly!",
      "Good try! Let's practice that sound again.",
      "Excellent! Your pronunciation is improving!",
      "Nice work! Keep it up!",
      "Wonderful! You're doing great!"
    ];
    
    const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
    
    res.json({
      success: true,
      feedback: randomFeedback,
      // Future: Add detailed analysis
      // accuracy: 0.85,
      // pronunciationScore: 0.9,
      // suggestions: ["Try emphasizing the 'r' sound more"]
    });
  }, 1000); // Simulate 1 second processing time
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SpeakQuest API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SpeakQuest Backend running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/analyze`);
});

