import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import { Title, Subtitle, SectionHeader } from '../components/ui/Typography';
import { getReviewQueue } from '../utils/storage';
import FramingPanel from '../components/FramingPanel';
import MetaFeedbackOverview from '../components/MetaFeedbackOverview';
import PracticeFocus from '../components/PracticeFocus';
import styles from '../styles/Home.module.css';

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
    <div className={styles.page}>
      <Container size="default">
        <Section spacing="large">
          <div className={styles.header}>
            <Title>EchoSense</Title>
            <Subtitle>AI-powered pronunciation practice with real-time feedback</Subtitle>
          </div>
        </Section>

        <Section spacing="default">
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
        </Section>
        
        <Section spacing="large">
          {/* Framing Panel */}
          <FramingPanel />
        </Section>
        
        <Section spacing="large">
          {/* Meta Feedback Overview */}
          <MetaFeedbackOverview />
        </Section>
        
        <Section spacing="large">
          {/* Practice Focus Suggestions */}
          <PracticeFocus limit={3} />
        </Section>
      </Container>
    </div>
  );
}

