'use strict';

export function isBalanced(str) {
  const brackets = {')': '(', ']': '[', '}': '{'};
  const workArr = [];

  for (const sym of str) {
    if (Object.values(brackets).includes(sym)) {
      workArr.push(sym);
    } else if (Object.keys(brackets).includes(sym)) {
      if (workArr[workArr.length - 1] !== brackets[sym]) {
        return false;
      } else {
        workArr.pop();
      }
    }
  }
  return workArr.length === 0;
}
