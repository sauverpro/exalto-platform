import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  CreditCard,
  Package,
  ShoppingBag,
  UserPlus,
} from "lucide-react";

/**
 * Dashboard notifications, built on the frontend from data the dashboard has
 * already loaded — there is no notifications API. Read state is kept per
 * browser in localStorage.
 */
export interface DashboardNotification {
  /**
   * Stable for the same event, and different once it changes (e.g. include the
   * order status), so a changed item shows up as unread again.
   */
  id: string;
  kind: "order" | "payment" | "stock" | "customer";
  tone: "info" | "warning" | "danger";
  title: string;
  detail: string;
  time?: string;
  /** Dashboard tab to open when the notification is clicked. */
  tab: string;
}

const KIND_ICON = {
  order: ShoppingBag,
  payment: CreditCard,
  stock: Package,
  customer: UserPlus,
};

const TONE_STYLE = {
  info: "bg-blue-400/10 text-blue-400",
  warning: "bg-ochre/15 text-ochre",
  danger: "bg-red-400/10 text-red-400",
};

function readIds(key: string): string[] {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Storage unavailable (private mode) — read state just won't persist.
  }
}

interface NotificationBellProps {
  notifications: DashboardNotification[];
  onOpenTab: (tab: string) => void;
  /** localStorage key, one per dashboard so their read states stay separate. */
  storageKey: string;
}

export default function NotificationBell({
  notifications,
  onOpenTab,
  storageKey,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [readIdList, setReadIdList] = useState<string[]>(() => readIds(storageKey));
  const wrapperRef = useRef<HTMLDivElement>(null);

  const readSet = new Set(readIdList);
  const unreadCount = notifications.filter((n) => !readSet.has(n.id)).length;
  const shown =
    filter === "unread"
      ? notifications.filter((n) => !readSet.has(n.id))
      : notifications;

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const saveRead = (ids: string[]) => {
    // Only keep ids that still exist, so the stored list can't grow forever.
    const current = new Set(notifications.map((n) => n.id));
    const next = Array.from(new Set(ids)).filter((id) => current.has(id));
    setReadIdList(next);
    writeIds(storageKey, next);
  };

  const markAllRead = () => saveRead(notifications.map((n) => n.id));

  const openNotification = (notification: DashboardNotification) => {
    saveRead([...readIdList, notification.id]);
    onOpenTab(notification.tab);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        className={`relative flex h-9 w-9 items-center justify-center rounded-xl border border-navy-line bg-navy transition hover:text-white ${
          open ? "text-white" : "text-ink"
        }`}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-11 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-navy-line bg-navy-dark shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-navy-line px-4 py-3">
            <div>
              <p className="text-sm font-bold text-white">Notifications</p>
              <p className="text-[11px] text-ink-muted">
                {unreadCount ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-brand transition hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <CheckCheck size={13} /> Mark all read
            </button>
          </div>

          {/* Filter */}
          <div className="flex gap-1 border-b border-navy-line px-4 py-2">
            {(["all", "unread"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`rounded-lg px-3 py-1 text-[11px] font-semibold capitalize transition ${
                  filter === value
                    ? "bg-navy text-white"
                    : "text-ink-muted hover:text-white"
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-[min(24rem,60vh)] overflow-y-auto">
            {shown.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-ink-muted">
                  <Bell size={16} />
                </span>
                <p className="text-sm font-semibold text-white">
                  {filter === "unread" ? "No unread notifications" : "Nothing needs your attention"}
                </p>
                <p className="text-xs text-ink-muted">
                  New orders, payments and stock alerts will show up here.
                </p>
              </div>
            ) : (
              shown.map((notification) => {
                const Icon = KIND_ICON[notification.kind];
                const unread = !readSet.has(notification.id);
                return (
                  <button
                    key={notification.id}
                    onClick={() => openNotification(notification)}
                    className="flex w-full items-start gap-3 border-b border-navy-line px-4 py-3 text-left transition last:border-b-0 hover:bg-navy"
                  >
                    <span
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${TONE_STYLE[notification.tone]}`}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-sm ${
                          unread ? "font-bold text-white" : "font-medium text-ink"
                        }`}
                      >
                        {notification.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-muted">
                        {notification.detail}
                      </span>
                      {notification.time && (
                        <span className="mt-1 block text-[10px] text-ink-muted">
                          {notification.time}
                        </span>
                      )}
                    </span>
                    {unread && (
                      <span
                        aria-label="Unread"
                        className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
