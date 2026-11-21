const ALPHABET_SIZE = 26;

export function isPangram(text) {
  const found = new Set();

  for (const char of text.toLowerCase()) {
    if (char >= 'a' && char <= 'z') {
      found.add(char);
    }
  }

  return found.size === ALPHABET_SIZE;
}
