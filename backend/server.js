/**
 * SpeakQuest Backend Server
 * Express API for speech analysis with OpenAI transcription
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlink = promisify(fs.unlink);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files - be lenient with mime types
    const allowedMimes = ['audio/webm', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mp4', 'audio/x-m4a', 'audio/ogg'];
    // Also accept if it starts with 'audio/'
    if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  },
});

// Middleware
app.use(cors()); // Allow frontend to make requests
app.use(express.json());

/**
 * Speech analysis endpoint with transcription
 * 
 * 1. Receives audio file
 * 2. Sends to OpenAI Whisper API for transcription
 * 3. Returns transcription and feedback
 */
app.post('/api/analyze', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file provided',
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured',
      });
    }

    // Determine file extension from mimetype
    const getFileExtension = (mimetype) => {
      const mimeToExt = {
        'audio/webm': '.webm',
        'audio/mpeg': '.mp3',
        'audio/mp3': '.mp3',
        'audio/wav': '.wav',
        'audio/m4a': '.m4a',
        'audio/mp4': '.mp4',
      };
      return mimeToExt[mimetype] || '.webm';
    };

    const fileExtension = getFileExtension(req.file.mimetype);
    const tempFilePath = path.join(__dirname, 'temp_audio_' + Date.now() + fileExtension);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    try {
      // Transcribe audio using OpenAI - try gpt-4o-transcribe first, fallback to whisper-1
      let transcription;
      try {
        transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(tempFilePath),
          model: 'gpt-4o-transcribe',
          response_format: 'text',
          prompt: req.body.prompt || '', // Optional prompt for context
        });
      } catch (gpt4Error) {
        // Fallback to whisper-1 if gpt-4o-transcribe fails
        console.log('Falling back to whisper-1:', gpt4Error.message);
        transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(tempFilePath),
          model: 'whisper-1',
          response_format: 'text',
          prompt: req.body.prompt || '',
        });
      }

      // Clean up temp file
      await unlink(tempFilePath);

      // Generate feedback based on transcription
      const feedback = generateFeedback(transcription, req.body.prompt);

      res.json({
        success: true,
        transcription: transcription.trim(),
        feedback: feedback,
      });
    } catch (transcriptionError) {
      // Clean up temp file on error
      if (fs.existsSync(tempFilePath)) {
        await unlink(tempFilePath);
      }
      throw transcriptionError;
    }
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to transcribe audio',
      transcription: null,
      feedback: "Oops! Something went wrong during transcription.",
    });
  }
});

/**
 * Generate feedback based on transcription
 */
function generateFeedback(transcription, prompt) {
  if (!transcription || !transcription.trim()) {
    return "I couldn't hear anything. Please try speaking louder!";
  }

  // Simple feedback generation
  // In a real app, you might want more sophisticated analysis
  const feedbacks = [
    "Great job! You said that perfectly!",
    "Excellent! Your pronunciation is improving!",
    "Nice work! Keep it up!",
    "Wonderful! You're doing great!",
  ];

  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

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

