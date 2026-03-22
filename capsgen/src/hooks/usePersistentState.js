import { useEffect, useState } from "react";

export function usePersistentState(key, initialValue, hydrate = (value) => value) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? hydrate(JSON.parse(raw)) : initialValue;
    } catch (error) {
      console.error(`Failed to hydrate localStorage key "${key}".`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Failed to persist localStorage key "${key}".`, error);
    }
  }, [key, state]);

  return [state, setState];
}
