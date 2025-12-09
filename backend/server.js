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
      // Request verbose_json to get metadata (segments, logprobs, etc.)
      let transcription;
      let whisperMetadata = null;
      
      try {
        const response = await openai.audio.transcriptions.create({
          file: fs.createReadStream(tempFilePath),
          model: 'gpt-4o-transcribe',
          response_format: 'verbose_json', // Get metadata
          prompt: req.body.prompt || '', // Optional prompt for context
        });
        
        // Handle both string (text format fallback) and object (verbose_json) responses
        if (typeof response === 'string') {
          transcription = response;
        } else {
          transcription = response.text || '';
          whisperMetadata = {
            segments: response.segments || [],
            language: response.language || null,
            duration: response.duration || null,
            // Extract average log probability from segments
            avgLogprob: response.segments && response.segments.length > 0
              ? response.segments.reduce((sum, seg) => sum + (seg.avg_logprob || 0), 0) / response.segments.length
              : null,
            compression_ratio: response.compression_ratio || null,
            no_speech_prob: response.no_speech_prob || null,
          };
        }
      } catch (gpt4Error) {
        // Fallback to whisper-1 if gpt-4o-transcribe fails
        console.log('Falling back to whisper-1:', gpt4Error.message);
        try {
          const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: 'whisper-1',
            response_format: 'verbose_json',
            prompt: req.body.prompt || '',
          });
          
          if (typeof response === 'string') {
            transcription = response;
          } else {
            transcription = response.text || '';
            whisperMetadata = {
              segments: response.segments || [],
              language: response.language || null,
              duration: response.duration || null,
              avgLogprob: response.segments && response.segments.length > 0
                ? response.segments.reduce((sum, seg) => sum + (seg.avg_logprob || 0), 0) / response.segments.length
                : null,
              compression_ratio: response.compression_ratio || null,
              no_speech_prob: response.no_speech_prob || null,
            };
          }
        } catch (whisperError) {
          // Final fallback: try text format if verbose_json fails
          console.log('Falling back to text format:', whisperError.message);
          transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: 'whisper-1',
            response_format: 'text',
            prompt: req.body.prompt || '',
          });
        }
      }

      // Clean up temp file
      await unlink(tempFilePath);

      // Generate feedback based on transcription
      const expectedText = extractExpectedText(req.body.prompt || '');
      const transcriptionText = typeof transcription === 'string' ? transcription.trim() : '';
      
      // Check if transcription is empty
      if (!transcriptionText) {
        return res.json({
          success: true,
          transcription: '',
          feedback: "I couldn't hear anything. Please try speaking louder!",
          matches: false,
          expectedText: expectedText,
          metadata: whisperMetadata,
        });
      }
      
      const matches = expectedText ? compareTranscription(transcriptionText, expectedText) : null;
      const feedback = generateFeedback(matches, expectedText);

      res.json({
        success: true,
        transcription: transcriptionText,
        feedback: feedback,
        matches: matches, // Include match status for frontend
        expectedText: expectedText, // Include expected text for debugging/display
        metadata: whisperMetadata, // Include Whisper metadata for advanced analysis
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
 * Extract expected text from prompt
 * Handles formats like:
 * - "Say the word: 'Rabbit'"
 * - "Try saying: 'Red'"
 * - "Say this sentence: 'The rabbit ran fast.'"
 */
function extractExpectedText(prompt) {
  if (!prompt) return null;
  
  // Look for text in quotes (single or double)
  const singleQuoteMatch = prompt.match(/['"]([^'"]+)['"]/);
  if (singleQuoteMatch) {
    return singleQuoteMatch[1].trim();
  }
  
  // Fallback: look for text after colon
  const colonMatch = prompt.match(/:\s*(.+)$/);
  if (colonMatch) {
    return colonMatch[1].trim();
  }
  
  return null;
}

/**
 * Normalize text for comparison (lowercase, remove punctuation, trim)
 */
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .trim();
}

/**
 * Compare transcription with expected text
 * Returns true if they match (with some tolerance for minor differences)
 */
function compareTranscription(transcription, expectedText) {
  if (!transcription || !expectedText) return false;
  
  const normalizedTranscription = normalizeText(transcription);
  const normalizedExpected = normalizeText(expectedText);
  
  // Exact match
  if (normalizedTranscription === normalizedExpected) {
    return true;
  }
  
  // Check if transcription contains the expected text (for longer sentences)
  if (normalizedTranscription.includes(normalizedExpected) || 
      normalizedExpected.includes(normalizedTranscription)) {
    return true;
  }
  
  // For word-level prompts, check if transcription contains the word
  const expectedWords = normalizedExpected.split(/\s+/);
  const transcriptionWords = normalizedTranscription.split(/\s+/);
  
  // If expected is a single word, check if it appears in transcription
  if (expectedWords.length === 1) {
    return transcriptionWords.includes(expectedWords[0]);
  }
  
  // For sentences, check if all key words are present
  const keyWords = expectedWords.filter(word => word.length > 2); // Ignore short words like "the", "a"
  const foundWords = keyWords.filter(word => 
    transcriptionWords.some(tw => tw === word || tw.includes(word) || word.includes(tw))
  );
  
  // Match if at least 80% of key words are found
  return foundWords.length >= Math.ceil(keyWords.length * 0.8);
}

/**
 * Generate feedback based on transcription comparison
 * @param {boolean} matches - Whether the transcription matches the expected text
 * @param {string} expectedText - The expected text (optional, for custom messages)
 */
function generateFeedback(matches, expectedText = null) {
  if (matches === null || matches === undefined) {
    return "Good try! Keep practicing!";
  }
  
  if (matches) {
    const positiveFeedbacks = [
      "Great job! You said that perfectly!",
      "Excellent! Your pronunciation is spot on!",
      "Perfect! You got it right!",
      "Wonderful! You said it correctly!",
      "Amazing! That was exactly right!",
    ];
    return positiveFeedbacks[Math.floor(Math.random() * positiveFeedbacks.length)];
  } else {
    const expectedMsg = expectedText ? ` The expected word was "${expectedText}".` : '';
    const encouragingFeedbacks = [
      `Good try!${expectedMsg} Let's try again!`,
      `Not quite right.${expectedMsg} Keep practicing!`,
      `Close! But the word was different.${expectedMsg} You can do it!`,
      `Almost there! The word didn't quite match.${expectedMsg} Try again!`,
    ];
    return encouragingFeedbacks[Math.floor(Math.random() * encouragingFeedbacks.length)];
  }
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

