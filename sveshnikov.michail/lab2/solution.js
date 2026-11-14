const ZODIAC = [
  {name: 'Водолей', from: [0, 20], to: [1, 18]},
  {name: 'Рыбы', from: [1, 19], to: [2, 20]},
  {name: 'Овен', from: [2, 21], to: [3, 19]},
  {name: 'Телец', from: [3, 20], to: [4, 20]},
  {name: 'Близнецы', from: [4, 21], to: [5, 20]},
  {name: 'Рак', from: [5, 21], to: [6, 22]},
  {name: 'Лев', from: [6, 23], to: [7, 22]},
  {name: 'Дева', from: [7, 23], to: [8, 22]},
  {name: 'Весы', from: [8, 23], to: [9, 22]},
  {name: 'Скорпион', from: [9, 23], to: [10, 21]},
  {name: 'Стрелец', from: [10, 22], to: [11, 21]},
  {name: 'Козерог', from: [11, 22], to: [0, 19]},
];

export function getZodiacSign(date) {
  const month = date.getMonth();
  const day = date.getDate();
  for (const zod of ZODIAC) {
    const isInFirstMonth = month === zod.from[0] && day >= zod.from[1];
    const isInSecondMonth = month === zod.to[0] && day <= zod.to[1];
    if (isInFirstMonth || isInSecondMonth) {
      return zod.name;
    }
  }
  return null;
}
