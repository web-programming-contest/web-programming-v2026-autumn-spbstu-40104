export function findMostFrequent(arr) {
  const counts = new Map();
  for (const item of arr) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }

  let mostFrequent;
  let maxCount = 0;
  for (const [item, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = item;
    }
  }
  return mostFrequent;
}
