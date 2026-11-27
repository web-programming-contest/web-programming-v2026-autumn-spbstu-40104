import React from 'react';
import {createRoot} from 'react-dom/client';
import {books, averageRating} from './books.js';
import {Rating} from './components/Rating.jsx';
import './styles.css';

function BookCard({book}) {
  const [userRating, setUserRating] = React.useState(null);
  const ratings =
    userRating === null ? book.ratings : [...book.ratings, userRating];

  return (
    <article className="book-card" data-testid="book-card">
      <img className="cover" src={book.cover} alt={`Обложка «${book.title}»`} />
      <h2>{book.title}</h2>
      <Rating rating={averageRating(ratings)} onVote={setUserRating} />
      <p className="description">{book.description}</p>
      <p className="price">{book.price} ₽</p>
    </article>
  );
}

function App() {
  return (
    <>
      <h1>Книжный магазин</h1>
      <p className="intro">Выбери книгу и поставь свою оценку.</p>
      <div className="books">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </>
  );
}

createRoot(document.querySelector('[data-testid="app"]')).render(<App />);
