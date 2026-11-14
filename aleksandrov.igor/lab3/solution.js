export function intersection(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return [];
  }

  const set1 = new Set(arr1);
  const filteredIntersection = arr2.filter((item) => set1.has(item));

  return [...new Set(filteredIntersection)];
}
