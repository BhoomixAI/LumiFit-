import { CatalogItem, CATALOG_DATA } from "@/data/catalog";

export function useCatalog() {
  return {
    catalog: CATALOG_DATA,
    loading: false,
    error: null,
  };
}