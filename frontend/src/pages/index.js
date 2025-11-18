import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

/**
 * Home Screen
 * Entry point of the app with "Start Practice" button
 * Using Kids Mode design system
 */
export default function Home() {
  const router = useRouter();

  const handleStartPractice = () => {
    router.push('/practice');
  };

  return (
    <div className={styles.container}>
      {/* Decorative background blurs */}
      <div className={styles.decorativeBlur1} />
      <div className={styles.decorativeBlur2} />
      
      <div className={styles.content}>
        <h1 className={styles.title}>🎤 SpeakQuest</h1>
        <p className={styles.subtitle}>Let's practice speaking together!</p>
        
        {/* Decorative dots */}
        <div className={styles.decorativeDots}>
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dot} />
        </div>
        
        <button 
          className="btn btn-primary-kids" 
          onClick={handleStartPractice}
          style={{ marginTop: 'var(--space-10)' }}
        >
          Start Practice
        </button>
      </div>
    </div>
  );
}

