export function calculateExpression(expr) {
  if (typeof expr !== 'string' || expr.trim() === '') {
    throw new Error('Введите непустое выражение.');
  }

  let position = 0;

  function skipSpaces() {
    while (position < expr.length && /\s/.test(expr[position])) {
      position++;
    }
  }

  function readNumber() {
    skipSpaces();
    let sign = 1;
    if (expr[position] === '+' || expr[position] === '-') {
      sign = expr[position] === '-' ? -1 : 1;
      position++;
      skipSpaces();
    }

    const match = expr.slice(position).match(/^(\d+(\.\d+)?|\.\d+)/);
    if (!match) {
      throw new Error(`Ожидалось число в позиции ${position + 1}.`);
    }
    position += match[0].length;
    const number = sign * Number(match[0]);
    if (!Number.isFinite(number)) {
      throw new Error('Слишком большое число.');
    }
    return number;
  }

  let result = 0;
  let term = readNumber();
  skipSpaces();

  // Сначала считаем произведения и частные, затем складываем слагаемые.
  while (position < expr.length) {
    const operator = expr[position];
    if (!'+-*/'.includes(operator)) {
      throw new Error(`Неизвестный оператор в позиции ${position + 1}.`);
    }
    position++;
    const number = readNumber();

    if (operator === '*') {
      term *= number;
    } else if (operator === '/') {
      if (number === 0) {
        throw new Error('Деление на ноль запрещено.');
      }
      term /= number;
    } else {
      result += term;
      term = operator === '+' ? number : -number;
    }
    if (!Number.isFinite(term) || !Number.isFinite(result)) {
      throw new Error('Результат выходит за допустимый диапазон чисел.');
    }
    skipSpaces();
  }

  result += term;
  if (!Number.isFinite(result)) {
    throw new Error('Результат выходит за допустимый диапазон чисел.');
  }
  return result;
}
