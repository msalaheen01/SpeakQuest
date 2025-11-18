# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

From the root directory, run:

```bash
npm run install:all
```

Or install manually:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

**Note:** The `dotenv` package is automatically installed with the backend dependencies. No separate installation needed.

## Step 2: Set Up Environment Variables

Before running the application, you need to configure your OpenAI API key:

1. **Create a `.env` file in the `backend` directory:**

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

2. **Get your OpenAI API key:**
   - Go to https://platform.openai.com/api-keys
   - Sign in or create an account
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)

3. **Add the key to your `.env` file:**
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   PORT=3001
   ```

   **Important:** Replace `sk-your-actual-api-key-here` with your actual key!

## Step 3: Run the Application

### Option A: Run Both Servers Together (Recommended)

From the root directory:

```bash
npm run dev
```

This will start:
- Backend on `http://localhost:3001`
- Frontend on `http://localhost:3000`

### Option B: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 4: Open the App

Navigate to: **http://localhost:3000**

## 🎯 Demo Flow

1. Click **"Start Practice"** on the home screen
2. Read the prompt and click the **microphone button**
3. **Allow microphone access** when your browser prompts you
4. Speak clearly into your microphone
5. Click the button again to stop (or wait for auto-stop)
6. See your transcription and feedback
7. Click **"Next"** to continue
8. Complete all 3 prompts
9. View your stars on the completion screen!

## ✅ Verification

- ✅ Backend API should respond at `http://localhost:3001/api/health`
- ✅ Frontend should load at `http://localhost:3000`
- ✅ No console errors in browser
- ✅ Microphone button animates when clicked

## 🐛 Troubleshooting

**Port already in use?**
- Change backend port: Set `PORT=3002` in `backend/.env`
- Change frontend port: `npm run dev -- -p 3001`

**Backend not connecting?**
- Check that backend is running on port 3001
- Verify CORS is enabled in server.js
- Check browser console for API errors

**"OPENAI_API_KEY is undefined" error?**
- Make sure you created a `.env` file in the `backend` directory
- Verify the file contains: `OPENAI_API_KEY=sk-your-key-here`
- Check there are no spaces around the `=` sign
- Restart your backend server after creating/modifying `.env`

**Transcription not working?**
- Verify your OpenAI API key is correct and active
- Check that you have credits in your OpenAI account
- Make sure microphone permissions are granted in your browser
- Check the backend console for error messages

**Microphone not working?**
- Allow microphone access when prompted by your browser
- Check browser settings to ensure microphone is enabled
- Try a different browser (Chrome, Firefox, Edge)
- Make sure no other application is using your microphone

**Dependencies not installing?**
- Make sure you have Node.js v16+ installed
- Try deleting `node_modules` and `package-lock.json` and reinstalling
- Make sure `dotenv` is installed: `cd backend && npm install dotenv`

