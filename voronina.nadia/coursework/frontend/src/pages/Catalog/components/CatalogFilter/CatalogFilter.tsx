import {useState} from 'react';

import {emptyFilters, type CatalogFilters} from '../../../../types/filters';

import styles from './CatalogFilter.module.scss';

interface CatalogFilterProps {
  categories: string[];
  colors: string[];
  onApply: (filters: CatalogFilters) => void;
  onReset: () => void;
}

export default function CatalogFilter({
  categories,
  colors,
  onApply,
  onReset,
}: CatalogFilterProps) {
  const [draft, setDraft] = useState<CatalogFilters>(emptyFilters);

  const [error, setError] = useState('');

  function toggleValue(field: 'categories' | 'colors', value: string) {
    setDraft((previous) => ({
      ...previous,
      [field]: previous[field].includes(value)
        ? previous[field].filter((item) => item !== value)
        : [...previous[field], value],
    }));
  }

  function handleApply() {
    const min = Number(draft.minPrice);
    const max = Number(draft.maxPrice);

    if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < 0) {
      setError('Введите корректную цену');
      return;
    }

    if (draft.minPrice !== '' && draft.maxPrice !== '' && min > max) {
      setError('Минимальная цена больше максимальной');
      return;
    }

    setError('');
    onApply(draft);
  }

  function handleReset() {
    setDraft(emptyFilters);
    setError('');
    onReset();
  }

  return (
    <aside className={styles.filters}>
      <section className={styles.section}>
        <h3>Цена, ₽</h3>

        <div className={styles.price}>
          <input
            type="number"
            min="0"
            aria-label="Минимальная цена"
            placeholder="От"
            value={draft.minPrice}
            onChange={(event) =>
              setDraft({
                ...draft,
                minPrice: event.target.value,
              })
            }
          />

          <input
            type="number"
            min="0"
            aria-label="Максимальная цена"
            placeholder="До"
            value={draft.maxPrice}
            onChange={(event) =>
              setDraft({
                ...draft,
                maxPrice: event.target.value,
              })
            }
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </section>

      <section className={styles.section}>
        <h3>Тип товара</h3>

        {categories.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              checked={draft.categories.includes(category)}
              onChange={() => toggleValue('categories', category)}
            />

            {category}
          </label>
        ))}
      </section>

      <section className={styles.section}>
        <h3>Цвет</h3>

        {colors.map((color) => (
          <label key={color}>
            <input
              type="checkbox"
              checked={draft.colors.includes(color)}
              onChange={() => toggleValue('colors', color)}
            />

            {color}
          </label>
        ))}
      </section>

      <div className={styles.buttons}>
        <button type="button" className={styles.apply} onClick={handleApply}>
          Показать
        </button>

        <button type="button" className={styles.reset} onClick={handleReset}>
          Сбросить
        </button>
      </div>
    </aside>
  );
}
