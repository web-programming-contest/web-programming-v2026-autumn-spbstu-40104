export interface CatalogFilters {
  minPrice: string;
  maxPrice: string;
  categories: string[];
  colors: string[];
}

export const emptyFilters: CatalogFilters = {
  minPrice: '',
  maxPrice: '',
  categories: [],
  colors: [],
};
