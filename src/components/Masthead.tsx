interface Props {
  used: number;
  limit: number;
  pro: boolean;
  onUpgrade: () => void;
}

export default function Masthead({ used, limit, pro, onUpgrade }: Props) {
  const remaining = Math.max(0, limit - used);
  return (
    <header className="border-b border-ink/15">
      <div className="mx-auto flex max-w-[1400px] items-end justify-between px-6 py-5 md:px-10">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-vermillion">
            Est. 2026
          </span>
          <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            The Illustration Atelier
          </h1>
        </div>
        <p className="hidden font-body text-sm italic text-sage md:block">
          a small press for synthetic pictures
        </p>
      </div>
      <div className="h-px w-full bg-ink/15" />
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50 md:px-10">
        <span className="hidden sm:inline">Vol. I</span>
        <span className="hidden md:inline">OpenAI · gpt-image-1</span>

        {/* Quota meter */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            {Array.from({ length: limit }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full border border-ink/40 ${
                  i < used ? 'bg-vermillion border-vermillion' : 'bg-transparent'
                }`}
              />
            ))}
          </span>
          <span className="text-ink/70">
            {remaining} of {limit} left{pro ? ' · patron' : ''}
          </span>
          {!pro && (
            <button
              onClick={onUpgrade}
              className="border border-ink px-2.5 py-1 uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
