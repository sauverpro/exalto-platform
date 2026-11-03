import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  SITE_CONTENT_DEFAULTS,
  SITE_CONTENT_KEY,
  type SiteContent,
} from "../data/siteContent";

interface SiteContentContextValue {
  /** Defaults with any saved edits applied on top. Never missing a key. */
  content: SiteContent;
  /** Persist a full content object and update every consumer. */
  publish: (next: SiteContent) => void;
  /** Drop all edits and go back to the shipped copy. */
  resetToDefaults: () => void;
}

const SiteContentContext = createContext<SiteContentContextValue | undefined>(
  undefined,
);

/**
 * Merging over the defaults means a field added to the schema later still
 * renders, instead of showing blank for anyone with older saved content.
 */
function readContent(): SiteContent {
  try {
    const stored = localStorage.getItem(SITE_CONTENT_KEY);
    if (!stored) return { ...SITE_CONTENT_DEFAULTS };
    const parsed = JSON.parse(stored) as SiteContent;
    return { ...SITE_CONTENT_DEFAULTS, ...parsed };
  } catch {
    return { ...SITE_CONTENT_DEFAULTS };
  }
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(readContent);

  // Keep other open tabs in step — the `storage` event fires only in tabs that
  // did not make the change, so editing in the dashboard updates a storefront
  // tab live.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === SITE_CONTENT_KEY) setContent(readContent());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const publish = useCallback((next: SiteContent) => {
    setContent(next);
    try {
      localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable; the change still applies for this session.
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    setContent({ ...SITE_CONTENT_DEFAULTS });
    try {
      localStorage.removeItem(SITE_CONTENT_KEY);
    } catch {
      // Nothing to clear.
    }
  }, []);

  const value = useMemo(
    () => ({ content, publish, resetToDefaults }),
    [content, publish, resetToDefaults],
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used inside SiteContentProvider");
  }
  return context;
}

/** Convenience reader for string fields, so pages don't cast everywhere. */
export function useText() {
  const { content } = useSiteContent();
  return useCallback(
    (key: string, fallback = "") => {
      const value = content[key];
      if (Array.isArray(value)) return value.join(", ");
      return value || fallback;
    },
    [content],
  );
}
