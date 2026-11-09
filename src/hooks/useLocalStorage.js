import { useEffect, useState } from "react";

/** useState gibi çalışır, ama değeri localStorage'a yazar ve açılışta geri okur. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Depolama dolu veya kapalıysa uygulama yine de çalışmaya devam eder
    }
  }, [key, value]);

  return [value, setValue];
}
