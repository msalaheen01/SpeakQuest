# Environment Variables Setup Guide

This guide explains how to set up environment variables for the SpeakQuest backend using `dotenv`.

## What is dotenv?

`dotenv` is a package that loads environment variables from a `.env` file into `process.env`. This allows you to:
- Keep sensitive information (like API keys) out of your code
- Use different configurations for development and production
- Share example configurations without exposing secrets

## Setup Steps

### 1. Create a `.env` file

In the `backend` directory, create a file named `.env` (note the leading dot).

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

### 2. Add your environment variables

Open the `.env` file and add your configuration:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3001
```

**Important:** 
- Never commit the `.env` file to git (it's already in `.gitignore`)
- Replace `sk-your-actual-api-key-here` with your real OpenAI API key
- Get your API key from: https://platform.openai.com/api-keys

### 3. How it works

The `dotenv` package is already configured in `server.js`. When the server starts, it automatically:
1. Looks for a `.env` file in the backend directory
2. Loads all variables from that file
3. Makes them available via `process.env.VARIABLE_NAME`

### 4. Using environment variables in code

In your code, access variables like this:

```javascript
const apiKey = process.env.OPENAI_API_KEY;
const port = process.env.PORT || 3001; // with fallback value
```

### 5. Example `.env` file structure

```env
# API Keys
OPENAI_API_KEY=sk-proj-abc123xyz...

# Server Settings
PORT=3001
NODE_ENV=development

# Database (if you add one later)
# DATABASE_URL=mongodb://localhost:27017/speakquest
```

## Best Practices

1. **Never commit `.env` files** - They contain secrets!
2. **Use `.env.example`** - Create a template file (already created) that shows what variables are needed without actual values
3. **Different environments** - You can have:
   - `.env` - Local development
   - `.env.production` - Production (loaded with `dotenv.config({ path: '.env.production' })`)
   - `.env.local` - Local overrides (usually gitignored)

## Troubleshooting

**Problem:** `OPENAI_API_KEY is undefined`
- **Solution:** Make sure your `.env` file exists in the `backend` directory
- **Solution:** Restart your server after creating/modifying `.env`
- **Solution:** Check that there are no spaces around the `=` sign: `OPENAI_API_KEY=value` (not `OPENAI_API_KEY = value`)

**Problem:** Variables not loading
- **Solution:** Make sure `require('dotenv').config()` is at the very top of your file (before other requires)
- **Solution:** Check that your `.env` file is in the same directory as your `server.js`

## Quick Start

1. Copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` and add your actual API key:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

3. Restart your server - the variables will be loaded automatically!

