import styles from '../../styles/ui/Grid.module.css';

/**
 * Grid Component
 * Provides responsive grid layouts
 * 
 * @param {object} props
 * @param {ReactNode} props.children - Grid items
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.columns - Number of columns (default: 2)
 * @param {string} props.gap - Gap size (small, default, large)
 */
export default function Grid({ children, className = '', columns = 2, gap = 'default' }) {
  return (
    <div 
      className={`${styles.grid} ${styles[`gap${gap}`]} ${className}`}
      style={{ '--grid-columns': columns }}
    >
      {children}
    </div>
  );
}

