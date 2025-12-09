import styles from '../../styles/ui/Typography.module.css';

/**
 * Typography Components
 * Provides consistent typography hierarchy
 */

export function Title({ children, className = '' }) {
  return <h1 className={`${styles.title} ${className}`}>{children}</h1>;
}

export function Subtitle({ children, className = '' }) {
  return <p className={`${styles.subtitle} ${className}`}>{children}</p>;
}

export function SectionHeader({ children, className = '' }) {
  return <h2 className={`${styles.sectionHeader} ${className}`}>{children}</h2>;
}

export function Body({ children, className = '' }) {
  return <p className={`${styles.body} ${className}`}>{children}</p>;
}

export function Label({ children, className = '' }) {
  return <span className={`${styles.label} ${className}`}>{children}</span>;
}

export function Small({ children, className = '' }) {
  return <span className={`${styles.small} ${className}`}>{children}</span>;
}

