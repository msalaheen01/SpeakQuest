# SpeakQuest Backend

Express.js API server for speech analysis.

## Current Endpoints

- `POST /api/analyze` - Simulated speech analysis
- `GET /api/health` - Health check

## Future Extensions

### Whisper API Integration

To add real speech-to-text:

```javascript
// future/whisper-integration.js
const { OpenAI } = require('openai');

async function analyzeWithWhisper(audioFile) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
  });
  return transcription;
}
```

### VR/Games API Endpoints

Future endpoints for VR and game integrations:

- `POST /api/vr/analyze` - VR-specific speech analysis
- `POST /api/games/validate` - Game speech challenge validation
- `GET /api/games/tasks` - Get available game tasks

### Database Integration

Currently all data is in-memory. Future database schema:

```javascript
// Future: User sessions, progress tracking, etc.
// Can use MongoDB, PostgreSQL, or Firebase
```

