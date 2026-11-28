import React, {StrictMode, useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

function Timer() {
  const [minutes, setMinutes] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const display =
    secondsLeft === null
      ? '00:00'
      : `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(
          secondsLeft % 60,
        ).padStart(2, '0')}`;

  const startTimer = () => {
    const mins = parseInt(minutes, 10);
    if (!mins || mins <= 0) {
      return;
    }

    setSecondsLeft(mins * 60);
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning || secondsLeft === null) {
      return;
    }

    if (secondsLeft === 0) {
      setIsRunning(false);
      alert('Готово');
      setSecondsLeft(null);
      setMinutes('');
      return;
    }

    const id = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [isRunning, secondsLeft]);

  return (
    <div className="timer">
      <input
        data-testid="timer-input"
        type="number"
        min="1"
        step="1"
        value={minutes}
        onChange={(e) => {
          const val = e.target.value;
          if (val === '' || /^[1-9]\d*$/.test(val)) {
            setMinutes(val);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            startTimer();
          }
        }}
        placeholder="Минуты"
        disabled={isRunning}
      />
      <button
        data-testid="timer-start"
        type="button"
        onClick={startTimer}
        disabled={isRunning || !minutes}
      >
        Запуск
      </button>
      <div className="time" data-testid="timer-display">
        {display}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <h1>Таймер</h1>
      <Timer />
    </div>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
