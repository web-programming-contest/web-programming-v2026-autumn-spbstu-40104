'use strict';

function zipArrays(...arrays) {
  if (arrays.length === 0) {
    return [];
  }

  let maxLength = 0;
  for (let i = 0; i < arrays.length; ++i) {
    if (arrays[i].length > maxLength) {
      maxLength = arrays[i].length;
    }
  }

  const result = [];
  for (let i = 0; i < maxLength; ++i) {
    const group = [];
    for (let j = 0; j < arrays.length; ++j) {
      const value = arrays[j][i];
      if (value !== undefined) {
        group.push(value);
      }
    }
    result.push(group);
  }

  return result;
}

export {zipArrays};
