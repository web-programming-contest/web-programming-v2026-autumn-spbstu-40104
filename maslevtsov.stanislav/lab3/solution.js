'use strict';

function maxSlidingWindow(arr, k) {
  if (!arr || arr.length === 0) {
    return [];
  }

  const result = [];
  const idxDeque = [];
  for (let i = 0; i < arr.length; i++) {
    if (idxDeque.length > 0 && idxDeque[0] < i - k + 1) {
      idxDeque.shift();
    }
    while (
      idxDeque.length > 0 &&
      arr[i] >= arr[idxDeque[idxDeque.length - 1]]
    ) {
      idxDeque.pop();
    }
    idxDeque.push(i);
    if (i >= k - 1) {
      result.push(arr[idxDeque[0]]);
    }
  }

  return result;
}

export {maxSlidingWindow};
