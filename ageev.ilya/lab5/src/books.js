import masterCover from '../assets/master.svg';
import crimeCover from '../assets/crime.svg';
import warCover from '../assets/war.svg';

export const books = [
  {
    id: 1,
    title: 'Мастер и Маргарита',
    description: 'Роман о любви, свободе и необычных событиях в Москве.',
    price: 650,
    cover: masterCover,
    ratings: [5, 4, 5, 4],
  },
  {
    id: 2,
    title: 'Преступление и наказание',
    description: 'Психологический роман о нравственном выборе.',
    price: 540,
    cover: crimeCover,
    ratings: [4, 5, 5],
  },
  {
    id: 3,
    title: 'Война и мир',
    description: 'Роман-эпопея о судьбах людей на фоне исторических событий.',
    price: 990,
    cover: warCover,
    ratings: [4, 4, 5],
  },
];

export function averageRating(ratings) {
  if (ratings.length === 0) {
    return 0;
  }
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}
