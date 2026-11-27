import React from 'react';

export function Rating({rating, onVote, starCount = 5}) {
  const [selected, setSelected] = React.useState(null);
  const timer = React.useRef(null);
  const displayed = selected ?? rating;

  React.useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  function vote(value) {
    onVote(value);
    setSelected(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSelected(null), 3500);
  }

  return (
    <div className="rating">
      <div className="stars">
        {Array.from({length: starCount}, (_, index) => {
          const value = index + 1;
          return (
            <button
              key={value}
              className="star"
              type="button"
              data-testid="rating-star"
              aria-label={`Поставить ${value} из ${starCount}`}
              aria-pressed={selected === value}
              onClick={() => vote(value)}
            >
              {value <= Math.round(displayed) ? '★' : '☆'}
            </button>
          );
        })}
      </div>
      <p className="rating-value" data-testid="rating-value" aria-live="polite">
        {selected === null ? 'Средний рейтинг' : 'Твоя оценка'}:{' '}
        {displayed.toFixed(1)} / {starCount}
      </p>
    </div>
  );
}
