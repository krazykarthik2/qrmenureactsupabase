// Calculates the Levenshtein distance between two strings
export function levenshteinDistance(s1, s2) {
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  const matrix = [];
  for (let i = 0; i <= s2.length; i++) matrix[i] = [i];
  for (let j = 0; j <= s1.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1) // deletion
        );
      }
    }
  }
  return matrix[s2.length][s1.length];
}

// Tokenizes sentences to handle word order jumble (e.g., "mhito green" -> "green mojito")
// It compares every query word against all target words.
export function fuzzyMatchWordJumble(query, target) {
  if (!query || !query.trim()) return true;
  if (!target) return false;

  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
  const targetWords = target.toLowerCase().split(/\s+/).filter(Boolean);

  if (queryWords.length === 0) return true;

  // We want to ensure EVERY query word has a relatively close match in the target
  let queryMatchScore = 0;
  
  for (const qW of queryWords) {
    let bestDistForWord = Infinity;
    
    for (const tW of targetWords) {
      if (tW.includes(qW)) {
        bestDistForWord = 0; // Exact substring match is perfect
        break;
      }
      const dist = levenshteinDistance(qW, tW);
      if (dist < bestDistForWord) bestDistForWord = dist;
    }

    // Determine an acceptable threshold
    // e.g. "mhito" vs "mojito" -> dist = 2, length = 5 (acceptable)
    // "mhig" vs "mojito" -> dist = 4, length = 4 (unacceptable)
    // Max distance is generous for longer words to allow deeper typos
    const maxAllowedDist = qW.length >= 5 ? 2 : (qW.length >= 3 ? 1 : 0);
    
    // If the word isn't matched within the allowed threshold, immediately fail
    // This enforces an AND logic across scrambled words
    if (bestDistForWord > maxAllowedDist) {
      return false;
    }
  }

  // If we found a fuzzy match for every word, it's a pass!
  return true;
}
