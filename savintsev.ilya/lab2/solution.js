export function findLongestPalindrome(str) {
  if (typeof str !== 'string' && !(str instanceof String)) {
    throw new TypeError('findLongestPalindrome uses only string');
  }
str = str.valueOf(); 
  const strlen = str.length;
  if (strlen < 2) {
    return '';
  }
  let palindrome = '';

  let back = 0;
  let forw = 1;
  let maxlen = 0;
  while (forw < strlen) {
    if (str[back] === str[forw]) // when abccba
    {
      let nowlen = 2;
      const word = [str[forw]];
      for (let i = forw + 1, j = back - 1; i < strlen && j >= 0; i++, j--) {
        if (str[i] === str[j]) {
          nowlen += 2;
          word.push(str[i]);
        } else {
          break;
        }
      }
      if (nowlen > maxlen) {
        maxlen = nowlen;
        palindrome = [...word].reverse().join('') + word.join('');
      }
    }
    forw++;
    if (forw < strlen && str[back] === str[forw]) // when abcdcba
    {
      let nowlen = 3;
      const word = [str[back + 1], str[forw]];
      for (let i = forw + 1, j = back - 1; i < strlen && j >= 0; i++, j--) {
        if (str[i] === str[j]) {
          nowlen += 2;
          word.push(str[i]);
        } else {
          break;
        }
      }
      if (nowlen > maxlen) {
        maxlen = nowlen;
        palindrome = [...word].reverse().join('') + word.slice(1).join('');
      }
    }
    back++;
  }
  return palindrome;
}
