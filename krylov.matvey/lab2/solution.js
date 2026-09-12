export function findLongestPalindrome(str) {
  if (!(typeof str === 'string')) {
    console.error('Not a string provided to function!');
  }
  let maxLenPalindrome = '';
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j <= str.length; j++) {
      const string = str.slice(i, j);
      if (string === string.split('').reverse().join('')) {
        if (maxLenPalindrome.length < string.length) {
          maxLenPalindrome = string;
        }
      }
    }
  }
  return maxLenPalindrome;
}
