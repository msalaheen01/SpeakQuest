import styles from '../../styles/ui/Section.module.css';

/**
 * Section Component
 * Provides consistent vertical spacing between sections
 * 
 * @param {object} props
 * @param {ReactNode} props.children - Section content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.spacing - Spacing variant (small, default, large)
 */
export default function Section({ children, className = '', spacing = 'default' }) {
  return (
    <section className={`${styles.section} ${styles[spacing]} ${className}`}>
      {children}
    </section>
  );
}

