import {useMemo, useState} from 'react';
import type {Product} from '../types/product';

import {emptyFilters, type CatalogFilters} from '../types/filters';

export type SortField = 'price' | 'rating' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 9;

export function useCatalog(products: Product[]) {
  const [sortField, setSortField] = useState<SortField>('createdAt');

  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [filters, setFilters] = useState<CatalogFilters>(emptyFilters);

  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    return [...new Set(products.map((product) => product.category))].sort();
  }, [products]);

  const colors = useMemo(() => {
    return [...new Set(products.map((product) => product.color))].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.minPrice !== '' && product.price < Number(filters.minPrice)) {
        return false;
      }

      if (filters.maxPrice !== '' && product.price > Number(filters.maxPrice)) {
        return false;
      }

      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }

      if (
        filters.colors.length > 0 &&
        !filters.colors.includes(product.color)
      ) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let result = 0;

      switch (sortField) {
        case 'price':
          result = a.price - b.price;
          break;

        case 'rating':
          result = a.rating - b.rating;
          break;

        case 'createdAt':
          result =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortDirection === 'asc' ? result : -result;
    });
  }, [filteredProducts, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedProducts.length / PAGE_SIZE);

  const currentPage = Math.max(1, Math.min(page, totalPages));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return sortedProducts.slice(start, end);
  }, [sortedProducts, currentPage]);

  function resetFilters() {
    setFilters(emptyFilters);
    setPage(1);
  }

  return {
    sortedProducts,
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
    filters,
    setFilters,
    resetFilters,
  };
}
