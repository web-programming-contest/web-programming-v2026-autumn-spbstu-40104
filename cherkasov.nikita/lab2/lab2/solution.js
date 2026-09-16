/**
 * Возвращает все простые числа <= n по возрастанию (решето Эратосфена).
 * @param {number} n
 * @returns {number[]}
 */
export function generatePrimes(n) {
  if (n < 2) {
    return [];
  }

  const isComposite = new Array(n + 1).fill(false);
  const primes = [];

  for (let i = 2; i <= n; i++) {
    if (!isComposite[i]) {
      primes.push(i);
      for (let multiple = i * i; multiple <= n; multiple += i) {
        isComposite[multiple] = true;
      }
    }
  }

  return primes;
}