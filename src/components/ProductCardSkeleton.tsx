/**
 * Placeholder shown while products load.
 *
 * Mirrors ProductCard's structure and aspect ratio so the grid doesn't jump
 * when the real cards arrive.
 */
export default function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-line bg-white"
    >
      <div className="aspect-[4/3] w-full bg-line" />

      <div className="flex flex-1 flex-col p-4">
        <div className="h-2.5 w-16 rounded bg-line" />
        <div className="mt-3 h-3 w-full rounded bg-line" />
        <div className="mt-2 h-3 w-3/5 rounded bg-line" />
        <div className="mt-4 h-4 w-24 rounded bg-line" />

        <div className="mt-auto flex gap-2 pt-4">
          <div className="h-9 flex-1 rounded-lg bg-line" />
          <div className="h-9 w-16 rounded-lg bg-line" />
        </div>
      </div>
    </div>
  );
}
