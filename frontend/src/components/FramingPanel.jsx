import styles from '../styles/FramingPanel.module.css';

/**
 * Framing Panel Component
 * HCI-forward explanation of the tool's purpose
 */
export default function FramingPanel() {
  return (
    <div className={styles.framingPanel}>
      <h2 className={styles.title}>Understand How AI Hears You</h2>
      <p className={styles.content}>
      This tool doesn't judge your speech. It shows how AI interprets it. 
      By practicing words and phrases, you'll develop an intuition for how Whisper sees clarity, pacing, pauses, and endings in your voice. Over time, you'll learn the patterns that AI detects. This will improve your communication with digital assistants, transcription tools, and any AI systems that listen.
      </p>
    </div>
  );
}

