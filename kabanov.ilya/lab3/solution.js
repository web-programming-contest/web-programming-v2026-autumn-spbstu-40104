export function rotateArray(arr, steps) {
  const len = arr.length;
  if (len === 0) {
    return [];
  }
  const n = ((steps % len) + len) % len;
  return n === 0 ? arr.slice() : [...arr.slice(-n), ...arr.slice(0, len - n)];
}
