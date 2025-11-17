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

## Step 2: Run the Application

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

## Step 3: Open the App

Navigate to: **http://localhost:3000**

## 🎯 Demo Flow

1. Click **"Start Practice"** on the home screen
2. Read the prompt and click the **microphone button**
3. Wait 2 seconds for recording simulation
4. See feedback and click **"Next"**
5. Complete all 3 prompts
6. View your stars on the completion screen!

## ✅ Verification

- ✅ Backend API should respond at `http://localhost:3001/api/health`
- ✅ Frontend should load at `http://localhost:3000`
- ✅ No console errors in browser
- ✅ Microphone button animates when clicked

## 🐛 Troubleshooting

**Port already in use?**
- Change backend port: Set `PORT=3002` in backend/.env
- Change frontend port: `npm run dev -- -p 3001`

**Backend not connecting?**
- Check that backend is running on port 3001
- Verify CORS is enabled in server.js
- Check browser console for API errors

**Dependencies not installing?**
- Make sure you have Node.js v16+ installed
- Try deleting `node_modules` and `package-lock.json` and reinstalling

