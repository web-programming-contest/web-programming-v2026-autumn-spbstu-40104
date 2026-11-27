const PAIRS = new Map([
  [')', '('],
  [']', '['],
  ['}', '{'],
]);

const OPENING = new Set(PAIRS.values());

export function isBalanced(str) {
  const stack = [];

  for (const char of String(str)) {
    if (OPENING.has(char)) {
      stack.push(char);
    } else if (PAIRS.has(char)) {
      if (stack.pop() !== PAIRS.get(char)) {
        return false;
      }
    }
  }

  return stack.length === 0;
}
