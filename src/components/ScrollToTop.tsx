import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router keeps the current scroll position when the route changes, so
 * navigating from the bottom of one page drops you into the middle (or footer)
 * of the next one. This resets every navigation back to the top.
 *
 * Links that point at an anchor (e.g. /export#quote) still jump to that
 * section instead of the top.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    // Stop the browser from re-applying its own remembered position on top of ours.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
