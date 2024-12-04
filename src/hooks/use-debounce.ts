/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useCallback, useEffect, useState } from "react";
// utils/debounce.ts
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number,
) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: Parameters<F>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

type FetchFunction<T> = (query: string) => Promise<T> | T;

interface UseDebounceProps<T> {
  getter: FetchFunction<T[]>;
  defaultValue?: T[];
  delay?: number;
  minLength?: number;
  maxResults?: number;
}

const useDebounce = <T>({
  getter,
  defaultValue = [],
  delay = 500,
  minLength = 2,
  maxResults = 10,
}: UseDebounceProps<T>) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>(defaultValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultValue.length > 0) {
      if (maxResults) {
        setResults(defaultValue.slice(0, maxResults));
      } else {
        setResults(defaultValue);
      }
    }
  }, [defaultValue, maxResults]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce(async (query: string) => {
      if (query.length < minLength) {
        return;
      }
      setLoading(true);
      const data = await getter(query);
      setResults(data);
      setLoading(false);
    }, delay),
    [getter, delay],
  );

  useEffect(() => {
    if (query) {
      debouncedFetch(query);
    }
  }, [query, debouncedFetch]);

  return { query, setQuery, results, loading };
};

export default useDebounce;
