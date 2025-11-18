import { useRouter } from 'next/router';
import styles from '../styles/Complete.module.css';

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

  // Calculate stars based on score (max 3 stars)
  const stars = Math.min(finalScore, 3);

  return (
    <div className={styles.container}>
      <div className="card">
        <h1 className={styles.title}>🎉 Session Complete!</h1>
        
        <p className={styles.message}>You did an amazing job!</p>

        {/* Stars Display */}
        <div className="stars">
          {[...Array(3)].map((_, index) => (
            <span 
              key={index} 
              className="star"
              style={{ 
                opacity: index < stars ? 1 : 0.3,
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

