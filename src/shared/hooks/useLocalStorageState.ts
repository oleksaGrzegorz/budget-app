import { useEffect, useState } from "react";

export const useLocalStorageState = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`Nie udało się zapisać danych: ${key}`);
    }
  }, [key, value]);

  return [value, setValue] as const;
};