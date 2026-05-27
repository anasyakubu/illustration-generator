import type { Plate } from '../lib/presets';

interface Props {
  loading: boolean;
  error: string | null;
  current: Plate | null;
}

function Loader() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-ink/30" />
        <div className="absolute inset-3 animate-spin rounded-full border-2 border-vermillion border-t-transparent" />
      </div>
      <p className="font-display text-xl">Inking the press…</p>
      <p className="max-w-xs font-body text-sm italic text-sage">
        The atelier is composing your plate. A fine illustration takes a moment
        to set.
      </p>
    </div>
  );
}

function Empty() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="font-display text-7xl text-ink/15">✎</div>
      <p className="font-display text-2xl">No plate on the press</p>
      <p className="max-w-sm font-body text-base italic text-sage">
        Write a brief, choose a house style, and commission your first
        illustration.
      </p>
    </div>
  );
}

export default function PlateCanvas({ loading, error, current }: Props) {
  return (
    <section
      aria-label="Illustration plate"
      className="flex flex-col"
    >
      <h2 className="sr-only">Plate viewer</h2>
      <div
        className="relative min-h-[460px] flex-1 border border-ink/20 bg-[#ece5d8]"
        aria-live="polite"
        aria-busy={loading}
      >
        {/* corner registration marks */}
        {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map(
          (pos) => (
            <span
              key={pos}
              className={`absolute ${pos} font-mono text-xs text-ink/30`}
            >
              +
            </span>
          ),
        )}

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-vermillion">
              Press fault
            </span>
            <p className="max-w-md font-body text-lg">{error}</p>
          </div>
        ) : current ? (
          <div className="flex h-full items-center justify-center p-6 md:p-10">
            <figure className="animate-fade-up">
              <img
                src={current.url}
                alt={current.prompt}
                className="max-h-[58vh] w-auto border border-ink/20 shadow-[0_24px_50px_-20px_rgba(22,19,16,0.55)]"
              />
              <figcaption className="mt-3 flex items-baseline justify-between gap-6 border-t border-ink/15 pt-2">
                <span className="font-body text-sm italic text-ink/70">
                  “{current.prompt}”
                </span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
                  {current.styleName.split('—')[0].trim()}
                </span>
              </figcaption>
            </figure>
          </div>
        ) : (
          <Empty />
        )}
      </div>

      {current && !loading && (
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
            Plate {current.id.slice(0, 6)} · {current.size}
          </span>
          <a
            href={current.url}
            download={`atelier-plate-${current.id.slice(0, 6)}.png`}
            className="border border-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors hover:bg-ink hover:text-paper"
          >
            ↓ Download plate
          </a>
        </div>
      )}
    </section>
  );
}
