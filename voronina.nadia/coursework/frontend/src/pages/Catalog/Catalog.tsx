import {useEffect, useState} from 'react';

import {getGoods} from '../../api/goods';
import type {Product} from '../../types/product';
import {useCatalog} from '../../hooks/useCatalog';

import ProductCard from '../../components/ProductCard/ProductCard';
import Pagination from '../../components/Pagination/Pagination';

import CatalogSort from './components/CatalogSort/CatalogSort';
import CatalogFilter from './components/CatalogFilter/CatalogFilter';

import styles from './Catalog.module.scss';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    paginatedProducts,
    currentPage,
    totalPages,
    setPage,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    categories,
    colors,
    setFilters,
    resetFilters,
  } = useCatalog(products);

  useEffect(() => {
    getGoods()
      .then(setProducts)
      .catch(() => {
        setError('Не удалось загрузить товары');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Загрузка товаров...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className={styles.catalog}>
      <h1>Каталог товаров</h1>

      <CatalogSort
        sortField={sortField}
        sortDirection={sortDirection}
        onFieldChange={(field) => {
          setSortField(field);
          setPage(1);
        }}
        onDirectionChange={(direction) => {
          setSortDirection(direction);
          setPage(1);
        }}
      />

      <div className={styles.content}>
        <div>
          {paginatedProducts.length === 0 ? (
            <p>Товары не найдены</p>
          ) : (
            <>
              <div className={styles.products}>
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setPage(page);

                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }}
              />
            </>
          )}
        </div>

        <CatalogFilter
          categories={categories}
          colors={colors}
          onApply={(filters) => {
            setFilters(filters);
            setPage(1);
          }}
          onReset={resetFilters}
        />
      </div>
    </section>
  );
}
