import { useEffect, useState } from "react";

export const MOBILE_BREAKPOINT = 850;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false); // Default to false to match server
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Return false during SSR/initial render to prevent hydration mismatch
  if (!mounted) {
    return false;
  }

  return !!isMobile;
}
