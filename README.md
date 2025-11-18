# 🎤 SpeakQuest - Speech Therapy App Prototype

A minimal but functional prototype of a speech therapy app designed for kids, featuring a gamified practice flow with simulated speech analysis.

## 📁 Project Structure

```
SpeakQuest/
├── frontend/          # Next.js React application
│   ├── src/
│   │   ├── pages/     # Next.js pages (routes)
│   │   ├── components/# React components
│   │   ├── styles/    # CSS modules
│   │   └── api/       # API client
│   └── package.json
├── backend/           # Express.js API server
│   ├── server.js      # Main server file
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (get one at https://platform.openai.com/api-keys)

### Installation & Running

#### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

**Note:** The `dotenv` package is already included in the dependencies. It will be installed automatically with `npm install`.

#### 2. Set Up Environment Variables

Create a `.env` file in the `backend` directory to store your OpenAI API key:

**Windows (PowerShell):**
```powershell
cd backend
New-Item -Path .env -ItemType File
```

**Windows (Command Prompt):**
```cmd
cd backend
type nul > .env
```

**Mac/Linux:**
```bash
cd backend
touch .env
```

Then open the `.env` file and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3001
```

**Getting Your OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-`)
5. Paste it into your `.env` file

**Important:**
- Never commit the `.env` file to git (it's already in `.gitignore`)
- Replace `sk-your-actual-api-key-here` with your actual key
- No spaces around the `=` sign: use `KEY=value` not `KEY = value`

#### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### 4. Run Both Servers

**Option A: Run in separate terminals**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:3001`

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

**Option B: Use a process manager (recommended for demo)**

You can use `concurrently` or `npm-run-all` to run both servers with one command. Add this to the root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

Then run from root:
```bash
npm install
npm run dev
```

## 🎮 How to Use

1. **Home Screen**: Click "Start Practice" to begin
2. **Practice Screen**: 
   - Read the speech prompt
   - Click the microphone button to start recording
   - Speak clearly into your microphone
   - Click the button again to stop recording (or it will auto-stop)
   - Wait for transcription and feedback
   - See what you said displayed on screen
   - Click "Next" to continue
3. **Complete Screen**: View your stars and score, then return home

**Note:** Make sure to allow microphone permissions when prompted by your browser.

## 🎨 Features

- ✅ Kids-friendly UI with bright colors and large buttons
- ✅ Real audio recording using Web Audio API
- ✅ Speech-to-text transcription using OpenAI Whisper API
- ✅ Real-time transcription display
- ✅ Progress tracking with visual progress bar
- ✅ Gamification: score and stars system
- ✅ Smooth animations and transitions
- ✅ Responsive design

## 🔮 Future Enhancements

The architecture is set up to easily add:

- **Database**: Store user progress and session history
- **VR/Games Integration**: Space prepared for immersive speech practice
- **Therapist Mode**: Admin dashboard for progress monitoring
- **Advanced Analytics**: Detailed pronunciation scoring and suggestions
- **Speaker Diarization**: Identify different speakers in recordings
- **Real-time Streaming**: Stream transcriptions as you speak

## 📝 API Endpoints

### POST `/api/analyze`
Speech transcription endpoint using OpenAI's Audio API.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Audio file (webm, mp3, wav, etc.) and optional prompt text

**Response:**
```json
{
  "success": true,
  "transcription": "The transcribed text from the audio",
  "feedback": "Great job! You said that perfectly!"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "transcription": null,
  "feedback": "Oops! Something went wrong during transcription."
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "SpeakQuest API is running"
}
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18
- **Backend**: Node.js, Express.js
- **Audio**: Web Audio API (MediaRecorder)
- **Transcription**: OpenAI Audio API (gpt-4o-transcribe / whisper-1)
- **File Upload**: Multer
- **Environment Variables**: dotenv
- **Styling**: CSS Modules with custom animations
- **No Database**: All data stored in memory (for demo)

## 📦 Development

### Backend Development
- Uses `nodemon` for auto-reload during development
- CORS enabled for frontend communication
- Environment variables loaded via `dotenv` from `.env` file
- Audio file uploads handled with `multer` (25MB limit)
- OpenAI API integration for speech transcription

### Frontend Development
- Next.js hot reload enabled
- Real audio recording with MediaRecorder API
- FormData used to send audio files to backend
- Fallback responses if backend is unavailable

### Environment Variables

The backend uses `dotenv` to load environment variables from a `.env` file. Required variables:

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (optional, defaults to 3001)

**Setup:**
1. `dotenv` is already installed as a dependency
2. Create a `.env` file in the `backend` directory
3. Add your `OPENAI_API_KEY` to the file
4. Restart the server after creating/modifying `.env`

See `backend/README_ENV.md` for detailed environment variable setup instructions.

## 🎯 Demo Flow

1. **Home** → Click "Start Practice"
2. **Practice** → 3 prompts with recording simulation
3. **Complete** → Shows stars and score

The entire flow takes approximately 1-2 minutes to demonstrate.

---

Built with ❤️ for speech therapy practice

