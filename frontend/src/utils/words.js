/**
 * Word List for EchoSense
 * Simple word list for pronunciation practice
 */

export const WORD_LIST = [
  'market',
  'project',
  'concept',
  'different',
  'system',
  'analysis',
  'strategy',
  'colleague',
  'algorithm',
  'specific',
  'thrilled',
  'strength',
  'squirrel',
  'rural',
  'entrepreneur',
  'rice',
  'right',
  'ship',
  'Krish',
  'Kamala',
];

/**
 * Get a random word from the list
 */
export function getRandomWord() {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

/**
 * Get next word in sequence (for practice mode)
 * @param {number} currentIndex - Current index in the list
 */
export function getNextWord(currentIndex = -1) {
  const nextIndex = (currentIndex + 1) % WORD_LIST.length;
  return {
    word: WORD_LIST[nextIndex],
    index: nextIndex,
  };
}

/**
 * Get word by index
 */
export function getWordByIndex(index) {
  if (index >= 0 && index < WORD_LIST.length) {
    return WORD_LIST[index];
  }
  return null;
}

