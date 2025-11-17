import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

/**
 * Home Screen
 * Entry point of the app with "Start Practice" button
 */
export default function Home() {
  const router = useRouter();

  const handleStartPractice = () => {
    router.push('/practice');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>🎤 SpeakQuest</h1>
        <p className={styles.subtitle}>Let's practice speaking together!</p>
        
        <button 
          className="btn" 
          onClick={handleStartPractice}
          style={{ marginTop: '40px' }}
        >
          Start Practice
        </button>

        {/* Optional: Future toggle for Kids Mode vs Therapist Mode */}
        {/* <div style={{ marginTop: '20px' }}>
          <label>
            <input type="checkbox" />
            Therapist Mode
          </label>
        </div> */}
      </div>
    </div>
  );
}

