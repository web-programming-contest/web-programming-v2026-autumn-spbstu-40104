import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages: (number | string)[] = [];

  if (totalPages <= 3) {
    for (let page = 1; page <= totalPages; page++) {
      pages.push(page);
    }
  } else {
    pages.push(1, 2, 3, '...');

    if (currentPage > 3 && currentPage < totalPages) {
      pages.push(currentPage);

      if (currentPage < totalPages - 1) {
        pages.push('...');
      }
    }

    pages.push(totalPages);
  }

  return (
    <nav className={styles.pagination} aria-label="Страницы каталога">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Предыдущая страница"
      >
        ←
      </button>

      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={page}
            type="button"
            className={page === currentPage ? styles.active : ''}
            aria-current={page === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={`dots-${index}`} className={styles.dots}>
            ...
          </span>
        ),
      )}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Следующая страница"
      >
        →
      </button>
    </nav>
  );
}
