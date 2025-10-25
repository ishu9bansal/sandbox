import { useEffect, useState } from "react";


export function useHydrationSafety() {
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
      setHydrating(false);
  }, []);

  return hydrating;
}
