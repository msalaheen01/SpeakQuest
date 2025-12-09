import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { getReviewQueue } from '../utils/storage';
import FramingPanel from '../components/FramingPanel';
import MetaFeedbackOverview from '../components/MetaFeedbackOverview';
import PracticeFocus from '../components/PracticeFocus';

/**
 * Home Screen - Professional Dashboard
 * Entry point with clean, modern layout
 */
export default function Home() {
  const router = useRouter();
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // Check review queue size
    const reviewQueue = getReviewQueue();
    setReviewCount(reviewQueue.length);
  }, []);

  const handleStartPractice = () => {
    router.push('/practice');
  };

  const handleReviewMistakes = () => {
    router.push('/review');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>SpeakBetter</h1>
          <p className={styles.subtitle}>
            AI-powered pronunciation practice with real-time feedback
          </p>
        </div>
        
        {/* Primary Action Buttons - Directly under title */}
        <div className={styles.actions}>
          <button 
            className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
            onClick={handleStartPractice}
          >
            Start Practice
          </button>
          
          {reviewCount > 0 && (
            <button 
              className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
              onClick={handleReviewMistakes}
            >
              Review Mistakes
              <span className={styles.reviewBadge}>{reviewCount}</span>
            </button>
          )}
        </div>
        
        {/* Framing Panel */}
        <FramingPanel />
        
        {/* Meta Feedback Overview */}
        <MetaFeedbackOverview />
        
        {/* Practice Focus Suggestions */}
        <PracticeFocus limit={3} />
      </div>
    </div>
  );
}

