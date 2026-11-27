function expandAroundCenter(str, left, right) {
  let start = left;
  let end = right;

  while (start >= 0 && end < str.length && str[start] === str[end]) {
    start -= 1;
    end += 1;
  }

  return {start: start + 1, end};
}

export function findLongestPalindrome(str) {
  let bestStart = 0;
  let bestEnd = 0;

  for (let center = 0; center < str.length; center += 1) {
    const candidates = [
      expandAroundCenter(str, center, center),
      expandAroundCenter(str, center, center + 1),
    ];

    for (const {start, end} of candidates) {
      if (end - start > bestEnd - bestStart) {
        bestStart = start;
        bestEnd = end;
      }
    }
  }

  return str.slice(bestStart, bestEnd);
}
