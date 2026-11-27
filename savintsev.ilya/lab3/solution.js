export function findEquilibriumIndex(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('findEquilibriumIndex works only with arrays');
  }
  let left = 0;
  let right = 0;
  for (const el of arr) {
    right += el;
  }
  for (let i = 0; i < arr.length; ++i) {
    if (i !== 0) {
      left += arr[i - 1];
    }
    right -= arr[i];
    if (left === right) {
      return i;
    }
  }
  return -1;
}
