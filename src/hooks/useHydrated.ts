"use client";

import { useEffect, useState } from "react";

/** Evita mismatch de hidratação para valores que só existem no browser (sessionStorage, etc.) */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
