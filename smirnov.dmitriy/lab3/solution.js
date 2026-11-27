function buildLookup(values) {
  const lookup = new Set();

  for (const value of values) {
    lookup.add(value);
  }

  return lookup;
}

export function difference(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw new TypeError('Оба аргумента должны быть массивами');
  }

  const excluded = buildLookup(arr2);
  const result = [];

  for (const item of arr1) {
    if (!excluded.has(item)) {
      result.push(item);
    }
  }

  return result;
}
