export function calculateExpression(expr) {
  let result = 0;

  const terms = expr.split('+');
  for (const term of terms) {
    let product = 1;
    const factors = term.split('*');

    for (const factor of factors) {
      product *= Number(factor);
    }

    result += product;
  }

  return result;
}
