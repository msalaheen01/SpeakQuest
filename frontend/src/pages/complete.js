import { useRouter } from 'next/router';
import styles from '../styles/Complete.module.css';

/**
 * Session Complete Screen
 * Professional completion view
 */
export default function Complete() {
  const router = useRouter();
  const { score } = router.query;
  const finalScore = score ? parseInt(score) : 0;

  const handleBackToHome = () => {
    router.push('/');
  };

  const totalStars = Math.max(finalScore, 0);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Session Complete</h1>
        
        <p className={styles.message}>Great work on your pronunciation practice!</p>

        {/* Stars Display */}
        <div className={styles.stars}>
          {[...Array(3)].map((_, index) => (
            <span 
              key={index} 
              className={styles.star}
              style={{ 
                opacity: index < totalStars ? 1 : 0.2,
              }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Score Display */}
        <div className={styles.scoreContainer}>
          <p className={styles.scoreLabel}>Score</p>
          <p className={styles.scoreValue}>{finalScore} / 3</p>
        </div>

        {/* Back to Home Button */}
        <button 
          className={styles.backButton}
          onClick={handleBackToHome}
        >
          Continue Practicing
        </button>
      </div>
    </div>
  );
}

