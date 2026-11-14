function isPrime(num) {
  if (num <= 1) {
    return false;
  }
  for (let i = 2; i * i <= num; ++i) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}

export function isPerfectNumber(n) {
  if (n <= 1 || !Number.isInteger(n) || (n & 1) !== 0) {
    return false;
  }

  for (let p = 2; ; ++p) {
    const powerOfTwo = 2 ** (p - 1);
    const mersenneCandidate = 2 ** p - 1;
    const perfectCandidate = powerOfTwo * mersenneCandidate;

    if (perfectCandidate === n) {
      return isPrime(mersenneCandidate);
    }

    if (perfectCandidate > n || perfectCandidate > Number.MAX_SAFE_INTEGER) {
      return false;
    }
  }
}
