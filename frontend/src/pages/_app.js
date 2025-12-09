import '../styles/globals.css';
import '../styles/design-system.css';

/**
 * Next.js App Component
 * Wraps all pages with global styles
 */
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

