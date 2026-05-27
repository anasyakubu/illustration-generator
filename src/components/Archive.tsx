import type { Plate } from '../lib/presets';

interface Props {
  plates: Plate[];
  currentId: string | null;
  onSelect: (p: Plate) => void;
  onClear: () => void;
}

export default function Archive({
  plates,
  currentId,
  onSelect,
  onClear,
}: Props) {
  return (
    <section className="border-t border-ink/15 pt-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-xl font-semibold">The Archive</h2>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
            {plates.length} plate{plates.length === 1 ? '' : 's'} on file
          </span>
          {plates.length > 0 && (
            <button
              onClick={onClear}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-vermillion hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {plates.length === 0 ? (
        <p className="font-body text-sm italic text-sage">
          Commissioned illustrations are catalogued here for this session.
        </p>
      ) : (
        <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2">
          {plates.map((p) => {
            const active = p.id === currentId;
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className={`group relative shrink-0 transition-all ${
                  active ? 'ring-2 ring-vermillion ring-offset-2 ring-offset-paper' : ''
                }`}
              >
                <img
                  src={p.url}
                  alt={p.prompt}
                  className="h-28 w-28 border border-ink/20 object-cover transition-opacity group-hover:opacity-85"
                />
                <span className="absolute bottom-0 left-0 right-0 truncate bg-ink/85 px-1.5 py-0.5 font-mono text-[9px] text-paper">
                  {p.prompt}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
