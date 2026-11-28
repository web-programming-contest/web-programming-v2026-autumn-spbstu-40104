import type {SortField, SortDirection} from '../../../../hooks/useCatalog';

import styles from './CatalogSort.module.scss';

interface CatalogSortProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onFieldChange: (field: SortField) => void;
  onDirectionChange: (direction: SortDirection) => void;
}

export default function CatalogSort({
  sortField,
  sortDirection,
  onFieldChange,
  onDirectionChange,
}: CatalogSortProps) {
  return (
    <div className={styles.sort}>
      <span>Сортировать по:</span>

      <select
        value={sortField}
        onChange={(event) => onFieldChange(event.target.value as SortField)}
      >
        <option value="price">Цене</option>
        <option value="rating">Популярности</option>
        <option value="createdAt">Новизне</option>
      </select>

      <button
        type="button"
        aria-label="Изменить направление сортировки"
        onClick={() =>
          onDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')
        }
      >
        {sortDirection === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
}
