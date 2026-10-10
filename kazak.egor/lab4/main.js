import {Movie} from './model.js';

const demoMovies = [
  new Movie('Начало', 'Кристофер Нолан', ['Леонардо Ди Каприо', 'Том Харди']),
  new Movie('Интерстеллар', 'Кристофер Нолан', [
    'Мэттью Макконахи',
    'Энн Хэтэуэй',
  ]),
  new Movie('Остров проклятых', 'Мартин Скорсезе', [
    'Леонардо Ди Каприо',
    'Марк Руффало',
    'Бен Кингсли',
  ]),
];

const storageKey = 'lab28-movies';
const movieForm = document.getElementById('movie-form');
const titleInput = document.getElementById('movie-title');
const directorInput = document.getElementById('movie-director');
const movieList = document.getElementById('movie-list');
const statusMessage = document.getElementById('status');
let busy = false;
const movies = loadMovies();

function loadMovies() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      const data = JSON.parse(saved);
      if (
        !Array.isArray(data) ||
        !data.every(
          (film) =>
            film &&
            typeof film.title === 'string' &&
            film.title.trim() !== '' &&
            typeof film.director === 'string' &&
            film.director.trim() !== '' &&
            Array.isArray(film.actors) &&
            film.actors.every((actor) => typeof actor === 'string'),
        )
      ) {
        throw new Error('Некорректные данные.');
      }
      // JSON хранит только поля. Создаём экземпляры заново, чтобы восстановить методы.
      return data.map(
        (film) => new Movie(film.title, film.director, film.actors),
      );
    }
  } catch {
    statusMessage.textContent =
      'Не удалось загрузить сохранённый список. Показаны примеры.';
  }
  return demoMovies.map(
    (film) => new Movie(film.title, film.director, film.actors),
  );
}

function saveMovies() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(movies));
    return true;
  } catch {
    return false;
  }
}

// Все изменения из интерфейса проходят через одну асинхронную функцию.
async function updateMovies(change) {
  if (busy) {
    return false;
  }
  busy = true;
  statusMessage.textContent = 'Выполняется…';
  document.querySelectorAll('button, input').forEach((element) => {
    element.disabled = true;
  });

  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          change();
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
    const saved = saveMovies();
    renderMovies();
    statusMessage.textContent = saved
      ? 'Изменения сохранены.'
      : 'Список обновлён, но браузер не разрешил сохранить данные.';
    return true;
  } catch (error) {
    statusMessage.textContent = `Ошибка: ${error.message}`;
    return false;
  } finally {
    busy = false;
    document.querySelectorAll('button, input').forEach((element) => {
      element.disabled = false;
    });
  }
}

function renderMovies() {
  movieList.replaceChildren();
  if (movies.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Фильмов пока нет. Добавьте первый фильм.';
    movieList.append(empty);
  }

  movies.forEach((film, index) => {
    const card = document.createElement('article');
    card.className = 'movie-card';
    card.dataset.testid = 'entity-card';

    const title = document.createElement('h2');
    title.textContent = film.title;
    const director = document.createElement('p');
    director.textContent = `Режиссёр: ${film.director}`;
    const count = document.createElement('p');
    count.textContent = `Количество актёров: ${film.castSize}`;
    card.append(title, director, count);

    const actors = document.createElement('ul');
    actors.className = 'actors';
    for (const actor of film.actors) {
      const item = document.createElement('li');
      const name = document.createElement('span');
      name.textContent = actor;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'delete-button';
      remove.textContent = 'Удалить актёра';
      remove.setAttribute('aria-label', `Удалить актёра: ${actor}`);
      remove.addEventListener('click', () =>
        updateMovies(() => film.removeActor(actor)),
      );
      item.append(name, remove);
      actors.append(item);
    }
    if (film.castSize === 0) {
      const empty = document.createElement('li');
      empty.textContent = 'Актёры не добавлены.';
      actors.append(empty);
    }
    card.append(actors);

    const actorForm = document.createElement('form');
    actorForm.className = 'actor-form';
    const label = document.createElement('label');
    label.textContent = 'Имя актёра';
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'actor';
    input.required = true;
    label.append(input);
    const add = document.createElement('button');
    add.type = 'submit';
    add.textContent = 'Добавить актёра';
    actorForm.append(label, add);
    actorForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = input.value.trim();
      if (!name) {
        statusMessage.textContent = 'Введите имя актёра.';
        return;
      }
      if (film.actors.includes(name)) {
        statusMessage.textContent = 'Этот актёр уже есть в списке.';
        return;
      }
      updateMovies(() => film.addActor(name));
    });

    const removeFilm = document.createElement('button');
    removeFilm.type = 'button';
    removeFilm.dataset.testid = 'delete-entity';
    removeFilm.className = 'delete-button';
    removeFilm.textContent = 'Удалить фильм';
    removeFilm.addEventListener('click', () =>
      updateMovies(() => movies.splice(index, 1)),
    );
    card.append(actorForm, removeFilm);
    movieList.append(card);
  });
}

movieForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const director = directorInput.value.trim();
  if (!title || !director) {
    statusMessage.textContent = 'Введите название фильма и режиссёра.';
    return;
  }
  const added = await updateMovies(() =>
    movies.push(new Movie(title, director)),
  );
  if (added) {
    movieForm.reset();
  }
});

renderMovies();
