import { useRouter } from 'next/router';
import styles from '../styles/Complete.module.css';

const STAR_ICON = '\u2605';

/**
 * Session Complete Screen
 * Shows completion message, stars, and score
 */
export default function Complete() {
  const router = useRouter();
  const { score } = router.query;
  const finalScore = score ? parseInt(score) : 0;

  const handleBackToHome = () => {
    router.push('/');
  };

  const totalStars = Math.max(finalScore, 0);
  const starArray = Array.from({ length: totalStars });

  return (
    <div className={styles.container}>
      <div className="card">
        <h1 className={styles.title}>Congratulations! Session Complete!</h1>
        
        <p className={styles.message}>You did an amazing job!</p>

        {/* Stars Display */}
        <div className="stars">
          {[...Array(3)].map((_, index) => (
            <span 
              key={index} 
              className="star"
              style={{ 
                opacity: index < totalStars ? 1 : 0.3,
                fontSize: '64px'
              }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Score Display */}
        <div className={styles.scoreContainer}>
          <p className={styles.scoreLabel}>You earned</p>
          <p className={styles.scoreValue}>{finalScore} {finalScore === 1 ? 'star' : 'stars'}!</p>
        </div>

        {/* Back to Home Button */}
        <button 
          className="btn btn-primary-kids" 
          onClick={handleBackToHome}
          style={{ marginTop: 'var(--space-10)' }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

