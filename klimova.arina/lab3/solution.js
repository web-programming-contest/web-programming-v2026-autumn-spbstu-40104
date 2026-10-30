export function countOccurrences(arr) {
  const result = {};

  for (const item of arr) {
    const key = String(item);

    if (result[key]) {
      result[key]++;
    } else {
      result[key] = 1;
    }
  }

  return result;
}
