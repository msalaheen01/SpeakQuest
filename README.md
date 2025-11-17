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

### Installation & Running

#### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### 3. Run Both Servers

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
   - Click the microphone button to start recording (simulated 2 seconds)
   - Wait for analysis feedback
   - Click "Next" to continue
3. **Complete Screen**: View your stars and score, then return home

## 🎨 Features

- ✅ Kids-friendly UI with bright colors and large buttons
- ✅ Simulated speech recording (2 seconds)
- ✅ Simulated speech analysis with feedback
- ✅ Progress tracking with visual progress bar
- ✅ Gamification: score and stars system
- ✅ Smooth animations and transitions
- ✅ Responsive design

## 🔮 Future Enhancements

The architecture is set up to easily add:

- **Real Speech Recognition**: Integrate OpenAI Whisper API or Web Speech API
- **Audio Recording**: Use Web Audio API for actual microphone input
- **Database**: Store user progress and session history
- **VR/Games Integration**: Space prepared for immersive speech practice
- **Therapist Mode**: Admin dashboard for progress monitoring
- **Advanced Analytics**: Detailed pronunciation scoring and suggestions

## 📝 API Endpoints

### POST `/api/analyze`
Simulated speech analysis endpoint.

**Request:**
```json
{
  "prompt": "placeholder",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "feedback": "Great job! You said that perfectly!"
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
- **Styling**: CSS Modules with custom animations
- **No Database**: All data stored in memory (for demo)

## 📦 Development

### Backend Development
- Uses `nodemon` for auto-reload during development
- CORS enabled for frontend communication
- Simulated 1-second delay for realistic API response

### Frontend Development
- Next.js hot reload enabled
- API proxy configured for development
- Fallback responses if backend is unavailable

## 🎯 Demo Flow

1. **Home** → Click "Start Practice"
2. **Practice** → 3 prompts with recording simulation
3. **Complete** → Shows stars and score

The entire flow takes approximately 1-2 minutes to demonstrate.

---

Built with ❤️ for speech therapy practice

