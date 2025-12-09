import styles from '../../styles/ui/Card.module.css';

/**
 * Reusable Card Component
 * Provides consistent card styling across the application
 * 
 * @param {object} props
 * @param {ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hover - Enable hover effects
 * @param {string} props.variant - Card variant (default, elevated, subtle)
 */
export default function Card({ children, className = '', hover = true, variant = 'default' }) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${hover ? styles.hover : ''} ${className}`}>
      {children}
    </div>
  );
}

