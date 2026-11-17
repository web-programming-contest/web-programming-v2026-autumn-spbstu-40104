export class Recipe {
  constructor(title, ingredients = [], steps = []) {
    this.title = String(title);
    this.ingredients = Array.isArray(ingredients) ? [...ingredients] : [];
    this.steps = Array.isArray(steps) ? [...steps] : [];
  }

  get ingredientCount() {
    return this.ingredients.length;
  }

  addIngredient(ingredient) {
    if (ingredient === null || ingredient === undefined || ingredient === '') {
      return;
    }
    this.ingredients.push(String(ingredient));
  }

  removeIngredient(ingredient) {
    const idx = this.ingredients.indexOf(String(ingredient));
    if (idx !== -1) {
      this.ingredients.splice(idx, 1);
    }
  }

  addStep(step) {
    if (step === null || step === undefined || step === '') {
      return;
    }
    this.steps.push(String(step));
  }

  removeStep(step) {
    const idx = this.steps.indexOf(String(step));
    if (idx !== -1) {
      this.steps.splice(idx, 1);
    }
  }

  get stepCount() {
    return this.steps.length;
  }
}

export function groupRecipesByIngredientCount(recipes) {
  const result = {};
  for (const r of recipes) {
    const key = String(r.ingredientCount);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(r);
  }
  return result;
}

export function getUniqueIngredients(recipes) {
  const set = new Set();
  for (const r of recipes) {
    for (const ing of r.ingredients) {
      set.add(ing);
    }
  }
  return [...set];
}

export function findRecipesByIngredient(recipes, ingredient) {
  const target = String(ingredient);
  return recipes.filter((r) => r.ingredients.includes(target));
}

export function groupRecipesByStepCount(recipes) {
  const result = {};
  for (const r of recipes) {
    const key = String(r.steps.length);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(r);
  }
  return result;
}

export function getRecipeTitles(recipes) {
  return recipes.map((r) => r.title);
}
