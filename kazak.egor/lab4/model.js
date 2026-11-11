export class Movie {
  constructor(title, director, actors = []) {
    this.title = title.trim();
    this.director = director.trim();
    this.actors = [];
    for (const name of actors) {
      this.addActor(name);
    }
  }

  addActor(name) {
    name = name.trim();
    if (name !== '' && !this.actors.includes(name)) {
      this.actors.push(name);
    }
  }

  removeActor(name) {
    this.actors = this.actors.filter((actor) => actor !== name.trim());
  }

  get castSize() {
    return this.actors.length;
  }
}

export function groupMoviesByDirector(films) {
  const groups = new Map();
  for (const film of films) {
    if (!groups.has(film.director)) {
      groups.set(film.director, []);
    }
    groups.get(film.director).push(film);
  }
  return groups;
}

export function getUniqueActors(films) {
  const actors = new Set();
  for (const film of films) {
    for (const actor of film.actors) {
      actors.add(actor);
    }
  }
  return [...actors];
}

export function groupMoviesByCastSize(films) {
  const groups = new Map();
  for (const film of films) {
    if (!groups.has(film.castSize)) {
      groups.set(film.castSize, []);
    }
    groups.get(film.castSize).push(film);
  }
  return groups;
}

export function findMoviesByActor(films, name) {
  return films.filter((film) => film.actors.includes(name.trim()));
}

export function getMovieTitles(films) {
  return films.map((film) => film.title);
}
