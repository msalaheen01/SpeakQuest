import { useState } from 'react';
import styles from '../styles/WhisperInterpretability.module.css';
import PunctuationTooltip from './PunctuationTooltip';

/**
 * Whisper Interpretability Panel
 * Shows how Whisper interpreted the audio in a human-friendly way
 * Helps users understand AI's perspective on their speech
 * 
 * @param {object} props
 * @param {object} props.result - Evaluation result with raw Whisper metadata
 * @param {string} props.expected - Expected word
 */
export default function WhisperInterpretability({ result, expected }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!result || !result.raw) {
    return null;
  }
  
  const { transcription, raw } = result;
  const normalizedTrans = transcription.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const normalizedExpected = expected.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  // Detect differences
  const hasPunctuation = /[.,!?;:]/.test(transcription);
  const isTruncated = normalizedTrans.length < normalizedExpected.length - 2;
  const isExtended = normalizedTrans.length > normalizedExpected.length + 2;
  const hasExtraWords = normalizedTrans.split(/\s+/).length > normalizedExpected.split(/\s+/).length;
  
  // Analyze punctuation
  const analyzePunctuation = () => {
    if (!hasPunctuation) return [];
    
    const result = [];
    const punctuationPatterns = [
      {
        pattern: /\./g,
        type: 'period',
        text: "Whisper added a period because your pronunciation sounded like a complete, standalone phrase. This often happens when there's a pause, breath noise, or a strong final stop consonant in your speech."
      },
      {
        pattern: /,/g,
        type: 'comma',
        text: "Whisper added a comma because your ending sounded incomplete or trailing. The comma suggests Whisper believes this is part of a longer phrase."
      },
      {
        pattern: /\?/g,
        type: 'question',
        text: "Whisper detected rising pitch at the end of your pronunciation. The question mark indicates your intonation sounded like a question."
      },
      {
        pattern: /!/g,
        type: 'exclamation',
        text: "Whisper detected unusually strong emphasis or higher volume in your speech. The exclamation mark suggests your pronunciation had extra energy or stress."
      },
      {
        pattern: /;/g,
        type: 'semicolon',
        text: "Whisper interpreted a pause that suggested a break in thought. The semicolon indicates Whisper detected a natural pause in your speech."
      },
      {
        pattern: /:/g,
        type: 'colon',
        text: "Whisper detected a pause that suggested you were about to continue speaking. The colon indicates Whisper thought your speech was introducing something more."
      }
    ];
    
    punctuationPatterns.forEach(({ pattern, type, text }) => {
      const matches = transcription.match(pattern);
      if (matches && matches.length > 0) {
        result.push({
          type,
          text,
          count: matches.length
        });
      }
    });
    
    return result;
  };
  
  const punctuationExplanations = analyzePunctuation();
  
  // Analyze formatting (capitalization and hyphens)
  const analyzeFormatting = () => {
    const result = [];
    const transText = transcription.trim();
    const expectedText = expected.trim();
    
    // Remove punctuation for capitalization analysis
    const transForCap = transText.replace(/[.,!?;:]/g, '');
    const expectedForCap = expectedText.replace(/[.,!?;:]/g, '');
    
    // Check for ALL CAPS (entire transcription is uppercase)
    if (transForCap === transForCap.toUpperCase() && 
        expectedForCap !== expectedForCap.toUpperCase() &&
        transForCap.length > 0) {
      result.push({
        type: 'all-caps',
        text: "All caps indicates Whisper detected strong emphasis or loudness in your pronunciation."
      });
      // Don't check other capitalization patterns if all caps, but still check for hyphens
    } else {
    
      // Check for initial capitalization
      const transFirstChar = transForCap.charAt(0);
      const expectedFirstChar = expectedForCap.charAt(0);
      if (transFirstChar && transFirstChar === transFirstChar.toUpperCase() && 
          expectedFirstChar && expectedFirstChar !== expectedFirstChar.toUpperCase()) {
        result.push({
          type: 'initial-cap',
          text: "Whisper capitalized this word because it interpreted your pronunciation as the beginning of a sentence."
        });
      }
      
      // Check for unexpected capitalization in middle of word (camelCase or mixed case)
      const transWithoutFirst = transForCap.slice(1);
      const expectedWithoutFirst = expectedForCap.slice(1);
      if (transWithoutFirst && /[A-Z]/.test(transWithoutFirst) && 
          expectedWithoutFirst && expectedWithoutFirst === expectedWithoutFirst.toLowerCase()) {
        result.push({
          type: 'unexpected-cap',
          text: "Whisper treated this as a proper noun or emphasized word, capitalizing letters in the middle."
        });
      }
    }
    
    // Check for hyphens
    if (/-/.test(transcription)) {
      const transWithoutPunct = transText.replace(/[.,!?;:]/g, '');
      
      // Check for repeated consonants with hyphens (e.g., "g-g-green", "b-b-blue")
      if (/([a-zA-Z])-\1/i.test(transcription)) {
        result.push({
          type: 'hyphen-repeat',
          text: "Repeated letters with a hyphen indicate the model heard an unstable or repeated consonant sound, like a stutter or hesitation."
        });
      }
      // Check for internal breaks within a word (e.g., "gree-en", "blu-e")
      else if (/-/.test(transWithoutPunct.replace(/\s/g, ''))) {
        // Check if hyphen is inside a word (not at word boundaries)
        const wordsWithHyphens = transWithoutPunct.split(/\s+/).filter(word => /-/.test(word));
        if (wordsWithHyphens.length > 0) {
          result.push({
            type: 'hyphen-internal',
            text: "The hyphen suggests Whisper detected a pause or break inside the word, possibly due to unclear pronunciation or a natural speech pause."
          });
        }
      }
      
      // General hyphen explanation if not already covered
      if (result.filter(r => r.type.startsWith('hyphen')).length === 0) {
        result.push({
          type: 'hyphen-general',
          text: "Hyphens often appear when Whisper is uncertain about word segmentation and tries to break the audio into smaller parts."
        });
      }
    }
    
    return result;
  };
  
  const formattingExplanations = analyzeFormatting();
  
  // Format metadata for display
  const formatMetadata = () => {
    const items = [];
    
    if (raw.avgLogprob !== null && raw.avgLogprob !== undefined) {
      items.push({
        label: 'Confidence Level',
        value: raw.avgLogprob > -0.3 ? 'High' : raw.avgLogprob > -0.6 ? 'Medium' : 'Low',
        detail: `Log probability: ${raw.avgLogprob.toFixed(3)}`,
      });
    }
    
    if (raw.language) {
      items.push({
        label: 'Detected Language',
        value: raw.language.toUpperCase(),
      });
    }
    
    if (raw.duration) {
      items.push({
        label: 'Audio Duration',
        value: `${raw.duration.toFixed(1)} seconds`,
      });
    }
    
    if (raw.no_speech_prob !== null && raw.no_speech_prob !== undefined) {
      const speechConfidence = (1 - raw.no_speech_prob) * 100;
      items.push({
        label: 'Speech Confidence',
        value: `${Math.round(speechConfidence)}%`,
        detail: speechConfidence < 70 ? 'Low - may indicate unclear audio' : 'Good',
      });
    }
    
    if (raw.compression_ratio !== null && raw.compression_ratio !== undefined) {
      items.push({
        label: 'Audio Quality',
        value: raw.compression_ratio > 2.5 ? 'Noisy' : raw.compression_ratio > 1.8 ? 'Fair' : 'Clear',
        detail: `Compression ratio: ${raw.compression_ratio.toFixed(2)}`,
      });
    }
    
    if (raw.segments && raw.segments.length > 0) {
      items.push({
        label: 'Audio Segments',
        value: `${raw.segments.length} segment${raw.segments.length !== 1 ? 's' : ''}`,
      });
    }
    
    return items;
  };
  
  const metadataItems = formatMetadata();
  
  return (
    <div className={styles.interpretabilityContainer}>
      <button 
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className={styles.toggleIcon}>{isExpanded ? '▼' : '▶'}</span>
        <span className={styles.toggleLabel}>How Whisper Heard You</span>
      </button>
      
      {isExpanded && (
        <div className={styles.content}>
          {/* Transcription Analysis */}
          <div className={styles.analysisSection}>
            <h4 className={styles.sectionTitle}>Transcription Analysis</h4>
            
            <div className={styles.analysisItem}>
              <span className={styles.analysisLabel}>Whisper heard:</span>
              <span className={styles.analysisValue}>
                "
                {transcription.split('').map((char, index) => {
                  if (/[.,!?\-]/.test(char)) {
                    return (
                      <PunctuationTooltip key={index} punctuation={char}>
                        <span>{char}</span>
                      </PunctuationTooltip>
                    );
                  }
                  return <span key={index}>{char}</span>;
                })}
                "
              </span>
            </div>
            
            <div className={styles.analysisItem}>
              <span className={styles.analysisLabel}>Expected:</span>
              <span className={styles.analysisValue}>"{expected}"</span>
            </div>
            
            {/* Detected Differences */}
            {(isTruncated || isExtended || hasExtraWords) && (
              <div className={styles.differencesSection}>
                <div className={styles.differencesTitle}>What Whisper detected:</div>
                <ul className={styles.differencesList}>
                  {isTruncated && (
                    <li>Heard a shorter version - the ending may have been unclear</li>
                  )}
                  {isExtended && (
                    <li>Heard extra sounds or letters</li>
                  )}
                  {hasExtraWords && (
                    <li>Detected multiple words instead of one</li>
                  )}
                </ul>
              </div>
            )}
            
            {/* Punctuation Interpretation */}
            {punctuationExplanations.length > 0 && (
              <div className={styles.punctuationSection}>
                <h4 className={styles.punctuationTitle}>Punctuation Interpretation</h4>
                <div className={styles.punctuationList}>
                  {punctuationExplanations.map((explanation, index) => (
                    <div key={index} className={styles.punctuationItem}>
                      <span className={styles.punctuationText}>{explanation.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Formatting Interpretation */}
            {formattingExplanations.length > 0 && (
              <div className={styles.formattingSection}>
                <h4 className={styles.formattingTitle}>Formatting Interpretation</h4>
                <div className={styles.formattingList}>
                  {formattingExplanations.map((explanation, index) => (
                    <div key={index} className={styles.formattingItem}>
                      <span className={styles.formattingText}>{explanation.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Whisper Metadata */}
          {metadataItems.length > 0 && (
            <div className={styles.metadataSection}>
              <h4 className={styles.sectionTitle}>Whisper's Interpretation</h4>
              {metadataItems.map((item, index) => (
                <div key={index} className={styles.metadataItem}>
                  <div className={styles.metadataRow}>
                    <span className={styles.metadataLabel}>{item.label}:</span>
                    <span className={styles.metadataValue}>{item.value}</span>
                  </div>
                  {item.detail && (
                    <div className={styles.metadataDetail}>{item.detail}</div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Educational Note */}
          <div className={styles.educationalNote}>
            <strong>💡 Understanding AI:</strong> Whisper uses probability to interpret speech. 
            These metrics show how confident the AI was in what it heard. Lower confidence doesn't 
            always mean your pronunciation was wrong—it could indicate audio quality issues.
          </div>
        </div>
      )}
    </div>
  );
}

