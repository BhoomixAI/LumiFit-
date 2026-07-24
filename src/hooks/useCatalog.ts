import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CatalogItem } from "@/data/catalog";

export function useCatalog() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCatalog() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("catalog_items")
          .select("*");

        if (cancelled) return;

        if (fetchError) {
          setError(fetchError.message);
          setCatalog([]);
          return;
        }

        setCatalog((data as CatalogItem[]) ?? []);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to fetch catalog");
        setCatalog([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  return { catalog, loading, error };
}
