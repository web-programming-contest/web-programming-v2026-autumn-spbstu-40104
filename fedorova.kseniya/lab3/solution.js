export function findPairsWithSum(arr, sum) {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an array');
  }

  const pairs = [];

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === sum) {
        pairs.push([arr[i], arr[j]]);
      }
    }
  }

  return pairs;
}
