'use strict';

function isArraysEqual(arr1, arr2) {
  if (!(Array.isArray(arr1) && Array.isArray(arr2))) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((elem1, index) => elem1 === arr2[index]);
}

function includesArray(arrFromCheck, arrToCheck) {
  return arrFromCheck.some((arr) => isArraysEqual(arr, arrToCheck));
}

export function findPairsWithSum(arr, sum) {
  const retArr = [];

  const arrSorted = arr.slice();
  arrSorted.sort((num1, num2) => num1 - num2);

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arrSorted[i] + arrSorted[j] === sum) {
        const pair = [arrSorted[i], arrSorted[j]];
        if (!includesArray(retArr, pair)) {
          retArr.push(pair);
        }
      }
      if (arrSorted[i] + arrSorted[j] > sum) {
        break;
      }
    }
  }
  return retArr;
}
