import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Save,
  Search,
  Undo2,
} from "lucide-react";
import {
  ALL_CMS_FIELDS,
  CMS_SCHEMA,
  SITE_CONTENT_DEFAULTS,
  type CmsField,
  type SiteContent,
} from "../../data/siteContent";
import { useSiteContent } from "../../context/SiteContentContext";

/** Comparable form for a value, so arrays diff correctly against strings. */
function normalise(value: unknown): string {
  return Array.isArray(value) ? value.join("|") : String(value ?? "");
}

interface CmsEditorProps {
  /** The page being edited — owned by the dashboard so its sidebar can pick it. */
  activePage: string;
  onPageChange: (pageId: string) => void;
}

export default function CmsEditor({ activePage, onPageChange }: CmsEditorProps) {
  const { content, publish, resetToDefaults } = useSiteContent();

  // The editor works on a draft; nothing reaches the live site until Publish.
  const [draft, setDraft] = useState<SiteContent>(content);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const page = CMS_SCHEMA.find((p) => p.id === activePage) ?? CMS_SCHEMA[0];

  // Whichever control switched the page (sidebar or tabs below), start fresh:
  // clear the search and open only the first section.
  useEffect(() => {
    setQuery("");
    setOpenSections({ [page.sections[0].id]: true });
  }, [page]);

  const changedKeys = useMemo(() => {
    return ALL_CMS_FIELDS.filter(
      (field) => normalise(draft[field.key]) !== normalise(content[field.key]),
    ).map((field) => field.key);
  }, [draft, content]);

  const customisedCount = useMemo(
    () =>
      ALL_CMS_FIELDS.filter(
        (field) =>
          normalise(draft[field.key]) !==
          normalise(SITE_CONTENT_DEFAULTS[field.key]),
      ).length,
    [draft],
  );

  const dirty = changedKeys.length > 0;

  // Searching filters fields across the whole page, and force-opens the
  // sections that still have matches so results aren't hidden in a closed panel.
  const visibleSections = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return page.sections
      .map((section) => ({
        ...section,
        fields: needle
          ? section.fields.filter(
              (field) =>
                field.label.toLowerCase().includes(needle) ||
                field.key.toLowerCase().includes(needle) ||
                normalise(draft[field.key]).toLowerCase().includes(needle),
            )
          : section.fields,
      }))
      .filter((section) => section.fields.length > 0);
  }, [page, query, draft]);

  const setField = (field: CmsField, raw: string) => {
    setDraft((current) => ({
      ...current,
      [field.key]: field.isArray
        ? raw.split(",").map((part) => part.trim()).filter(Boolean)
        : raw,
    }));
  };

  const handlePublish = () => {
    publish(draft);
    setSavedAt(new Date().toLocaleTimeString());
  };

  const handleDiscard = () => setDraft(content);

  const handleResetAll = () => {
    resetToDefaults();
    setDraft({ ...SITE_CONTENT_DEFAULTS });
    setSavedAt(new Date().toLocaleTimeString());
  };

  const resetSection = (fields: CmsField[]) => {
    setDraft((current) => {
      const next = { ...current };
      fields.forEach((field) => {
        next[field.key] = SITE_CONTENT_DEFAULTS[field.key];
      });
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Content Manager</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Edit the words on your website without touching code.{" "}
            <span className="text-ink">
              {customisedCount} of {ALL_CMS_FIELDS.length} fields customised
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={page.path}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center gap-2 rounded-xl border border-navy-line bg-navy px-4 text-xs font-semibold text-ink transition hover:text-white"
          >
            <ExternalLink size={13} /> View page
          </a>

          <button
            onClick={handleDiscard}
            disabled={!dirty}
            className="flex h-10 items-center gap-2 rounded-xl border border-navy-line bg-navy px-4 text-xs font-semibold text-ink transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Undo2 size={13} /> Discard
          </button>

          <button
            onClick={handlePublish}
            disabled={!dirty}
            className="flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-xs font-bold text-white shadow-[0_4px_15px_rgba(31,107,69,0.35)] transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand"
          >
            <Save size={13} />
            {dirty ? `Publish ${changedKeys.length} change${changedKeys.length === 1 ? "" : "s"}` : "Published"}
          </button>
        </div>
      </div>

      {/* Status strip */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs ${
          dirty
            ? "border-ochre/40 bg-ochre/10 text-ochre"
            : "border-emerald-900/50 bg-emerald-950/20 text-emerald-400"
        }`}
      >
        <span className="font-semibold">
          {dirty
            ? `You have unsaved changes in ${changedKeys.length} field${changedKeys.length === 1 ? "" : "s"}.`
            : savedAt
              ? `All changes published at ${savedAt}.`
              : "Everything is published."}
        </span>
        <button
          onClick={handleResetAll}
          className="flex items-center gap-1.5 font-semibold text-ink-muted transition hover:text-white"
        >
          <RotateCcw size={12} /> Reset all to original copy
        </button>
      </div>

      {/* Page tabs */}
      <div className="flex flex-wrap gap-2">
        {CMS_SCHEMA.map((entry) => {
          const pageChanges = entry.sections
            .flatMap((section) => section.fields)
            .filter((field) => changedKeys.includes(field.key)).length;

          return (
            <button
              key={entry.id}
              onClick={() => onPageChange(entry.id)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition ${
                page.id === entry.id
                  ? "bg-brand text-white shadow-[0_4px_15px_rgba(31,107,69,0.35)]"
                  : "border border-navy-line text-ink hover:border-brand/50 hover:text-white"
              }`}
            >
              {entry.label}
              {pageChanges > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ochre px-1.5 text-[10px] font-bold text-navy-deep">
                  {pageChanges}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${page.label} fields...`}
          className="w-full rounded-xl border border-navy-line bg-navy py-2.5 pl-9 pr-4 text-sm text-white placeholder-ink-muted outline-none focus:border-brand"
        />
      </div>

      {/* Sections */}
      {visibleSections.length === 0 ? (
        <p className="rounded-2xl border border-navy-line bg-navy-dark px-6 py-10 text-center text-sm text-ink">
          No fields match “{query}”.
        </p>
      ) : (
        visibleSections.map((section) => {
          const open = query.trim() ? true : (openSections[section.id] ?? false);
          const sectionChanges = section.fields.filter((field) =>
            changedKeys.includes(field.key),
          ).length;

          return (
            <div
              key={section.id}
              className="overflow-hidden rounded-2xl border border-navy-line bg-navy-dark"
            >
              <div className="flex items-center justify-between gap-3 px-4 sm:px-6">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((current) => ({
                      ...current,
                      [section.id]: !open,
                    }))
                  }
                  className="flex flex-1 items-center gap-3 py-4 text-left"
                  aria-expanded={open}
                >
                  <ChevronRight
                    size={16}
                    className={`flex-shrink-0 text-ink transition-transform ${open ? "rotate-90" : ""}`}
                  />
                  <span className="text-sm font-bold text-white">
                    {section.title}
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    {section.fields.length} field
                    {section.fields.length === 1 ? "" : "s"}
                  </span>
                  {sectionChanges > 0 && (
                    <span className="rounded-full bg-ochre/20 px-2 py-0.5 text-[10px] font-bold text-ochre">
                      {sectionChanges} edited
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => resetSection(section.fields)}
                  title="Restore this section's original copy"
                  className="flex-shrink-0 text-ink-muted transition hover:text-white"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              {open && (
                <div className="grid gap-4 border-t border-navy-line px-4 pb-6 pt-5 sm:grid-cols-2 sm:px-6">
                  {section.fields.map((field) => {
                    const value = field.isArray
                      ? ((draft[field.key] as string[]) ?? []).join(", ")
                      : String(draft[field.key] ?? "");
                    const edited = changedKeys.includes(field.key);

                    return (
                      <label
                        key={field.key}
                        className={`text-xs font-semibold text-ink ${field.long ? "sm:col-span-2" : ""}`}
                      >
                        <span className="flex items-center gap-2">
                          {field.label}
                          {edited && (
                            <span className="h-1.5 w-1.5 rounded-full bg-ochre" />
                          )}
                        </span>

                        {field.long ? (
                          <textarea
                            rows={3}
                            value={value}
                            onChange={(event) =>
                              setField(field, event.target.value)
                            }
                            className={`mt-2 w-full resize-y rounded-xl border bg-navy px-4 py-3 text-sm text-white outline-none transition focus:border-brand ${
                              edited ? "border-ochre/50" : "border-navy-line"
                            }`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(event) =>
                              setField(field, event.target.value)
                            }
                            className={`mt-2 w-full rounded-xl border bg-navy px-4 py-3 text-sm text-white outline-none transition focus:border-brand ${
                              edited ? "border-ochre/50" : "border-navy-line"
                            }`}
                          />
                        )}

                        <span className="mt-1.5 flex items-center justify-between gap-2 text-[10px] font-normal text-ink-muted">
                          <span>{field.hint ?? ""}</span>
                          <span className="flex-shrink-0">{value.length} chars</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
