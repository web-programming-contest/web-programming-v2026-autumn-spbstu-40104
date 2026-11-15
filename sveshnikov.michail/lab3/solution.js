export function sortByFrequency(arr) {
  const map = new Map();
  for (const elem of arr) {
    map.set(elem, (map.get(elem) || 0) + 1);
  }

  const sortedEntries = [...map.entries()].sort((a, b) => b[1] - a[1]);

  const res = [];
  for (const [elem, count] of sortedEntries) {
    for (let j = 0; j < count; j++) {
      res.push(elem);
    }
  }
  return res;
}
