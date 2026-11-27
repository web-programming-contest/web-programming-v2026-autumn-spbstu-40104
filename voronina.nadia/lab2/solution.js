export function toBinary(num) {
  if (num === 0) {
    return '0';
  }

  let result = '';

  while (num > 0) {
    result = (num % 2) + result;
    num = Math.floor(num / 2);
  }

  return result;
}
