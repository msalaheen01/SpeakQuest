import styles from '../../styles/ui/Container.module.css';

/**
 * Container Component
 * Provides consistent page container with max-width and padding
 * 
 * @param {object} props
 * @param {ReactNode} props.children - Container content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Container size (narrow, default, wide)
 */
export default function Container({ children, className = '', size = 'default' }) {
  return (
    <div className={`${styles.container} ${styles[size]} ${className}`}>
      {children}
    </div>
  );
}

