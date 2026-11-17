import {Recipe} from './model.js';

const STORAGE_KEY = 'lab4-recipes';
const DELAY = 300;

function delay(fn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, DELAY);
  });
}

function save(recipes) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      recipes.map((r) => ({
        title: r.title,
        ingredients: r.ingredients,
        steps: r.steps,
      })),
    ),
  );
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map(
      (item) => new Recipe(item.title, item.ingredients, item.steps),
    );
  } catch {
    return [];
  }
}

function parseList(text) {
  return String(text || '')
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const recipes = load();
const form = document.querySelector('form[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');

function render() {
  list.innerHTML = '';

  recipes.forEach((recipe, index) => {
    const card = document.createElement('article');
    card.setAttribute('data-testid', 'entity-card');

    const title = document.createElement('h3');
    title.textContent = recipe.title;

    const meta = document.createElement('p');
    meta.textContent = `Ингредиентов: ${recipe.ingredientCount} · Шагов: ${recipe.steps.length}`;

    const ingredients = document.createElement('p');
    ingredients.textContent = `Ингредиенты: ${recipe.ingredients.join(', ') || 'нет'}`;

    const steps = document.createElement('p');
    steps.textContent = `Шаги: ${recipe.steps.join(' → ') || 'нет'}`;

    const actions = document.createElement('div');

    const addIng = document.createElement('button');
    addIng.type = 'button';
    addIng.textContent = 'Добавить ингредиент';
    addIng.dataset.action = 'add-ingredient';
    addIng.dataset.index = String(index);

    const removeIng = document.createElement('button');
    removeIng.type = 'button';
    removeIng.textContent = 'Удалить ингредиент';
    removeIng.dataset.action = 'remove-ingredient';
    removeIng.dataset.index = String(index);

    const addStep = document.createElement('button');
    addStep.type = 'button';
    addStep.textContent = 'Добавить шаг';
    addStep.dataset.action = 'add-step';
    addStep.dataset.index = String(index);

    const removeStep = document.createElement('button');
    removeStep.type = 'button';
    removeStep.textContent = 'Удалить шаг';
    removeStep.dataset.action = 'remove-step';
    removeStep.dataset.index = String(index);

    const del = document.createElement('button');
    del.type = 'button';
    del.textContent = 'Удалить рецепт';
    del.setAttribute('data-testid', 'delete-entity');
    del.dataset.index = String(index);

    actions.append(addIng, removeIng, addStep, removeStep, del);
    card.append(title, meta, ingredients, steps, actions);
    list.appendChild(card);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = form.querySelector('[name="title"]').value.trim();
  if (!title) {
    return;
  }

  const ingredients = parseList(
    form.querySelector('[name="ingredients"]').value,
  );
  const steps = parseList(form.querySelector('[name="steps"]').value);

  delay(() => {
    recipes.push(new Recipe(title, ingredients, steps));
    form.reset();
    save(recipes);
    render();
  });
});

list.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) {
    return;
  }

  const index = Number(btn.dataset.index);
  const recipe = recipes[index];
  if (!recipe) {
    return;
  }

  if (btn.matches('[data-testid="delete-entity"]')) {
    delay(() => {
      recipes.splice(index, 1);
      save(recipes);
      render();
    });
    return;
  }

  const action = btn.dataset.action;

  if (action === 'add-ingredient') {
    const value = prompt('Новый ингредиент:');
    if (!value || !value.trim()) {
      return;
    }
    delay(() => {
      recipe.addIngredient(value.trim());
      save(recipes);
      render();
    });
    return;
  }

  if (action === 'remove-ingredient') {
    const value = prompt(
      'Какой ингредиент удалить?',
      recipe.ingredients[0] || '',
    );
    if (!value || !value.trim()) {
      return;
    }
    delay(() => {
      recipe.removeIngredient(value.trim());
      save(recipes);
      render();
    });
    return;
  }

  if (action === 'add-step') {
    const value = prompt('Новый шаг:');
    if (!value || !value.trim()) {
      return;
    }
    delay(() => {
      recipe.addStep(value.trim());
      save(recipes);
      render();
    });
    return;
  }

  if (action === 'remove-step') {
    const value = prompt('Какой шаг удалить?', recipe.steps[0] || '');
    if (!value || !value.trim()) {
      return;
    }
    delay(() => {
      recipe.removeStep(value.trim());
      save(recipes);
      render();
    });
  }
});

render();
