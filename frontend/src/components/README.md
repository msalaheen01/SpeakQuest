# Components

## Current Components

- **MicButton.jsx**: Microphone button with recording simulation

## Future Components

### VR/Games Integration Space

This directory can be extended with:

- **VRSpeechTask.jsx**: Component for VR-based speech practice
- **GameSpeechTask.jsx**: Component for gamified speech challenges
- **SpeechGameEngine.jsx**: Core game logic for speech-based games

### Integration Pattern

Future VR/game components should:
1. Accept speech prompts as props
2. Use the same `analyzeSpeech` API from `../api/index.js`
3. Return feedback in the same format
4. Integrate with the existing routing system

Example structure:
```jsx
// Future: VRSpeechTask.jsx
export default function VRSpeechTask({ prompt, onComplete }) {
  // VR implementation
  // Uses analyzeSpeech() from api/index.js
  // Calls onComplete() when done
}
```

