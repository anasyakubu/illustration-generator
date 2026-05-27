import { STYLE_PRESETS, SIZES, QUALITIES } from '../lib/presets';
import type { ImageSize, Quality } from '../lib/openai';

interface Props {
  prompt: string;
  setPrompt: (v: string) => void;
  styleId: string;
  setStyleId: (v: string) => void;
  size: ImageSize;
  setSize: (v: ImageSize) => void;
  quality: Quality;
  setQuality: (v: Quality) => void;
  loading: boolean;
  quotaReached: boolean;
  onGenerate: () => void;
}

const IDEAS = [
  'a fox reading letters by candlelight',
  'an observatory adrift in clouds',
  'a greenhouse of impossible plants',
  'two travellers sharing tea on a cliff',
];

export default function ComposePanel({
  prompt,
  setPrompt,
  styleId,
  setStyleId,
  size,
  setSize,
  quality,
  setQuality,
  loading,
  quotaReached,
  onGenerate,
}: Props) {
  return (
    <aside className="flex flex-col gap-7">
      {/* Prompt */}
      <div>
        <label className="mb-2 flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
            01 — The Brief
          </span>
          <span className="font-mono text-[10px] text-ink/35">
            {prompt.length}/1000
          </span>
        </label>
        <textarea
          value={prompt}
          maxLength={1000}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the picture you wish to commission…"
          rows={5}
          className="w-full resize-none border border-ink/20 bg-transparent px-4 py-3 font-body text-lg leading-snug outline-none transition-colors focus:border-vermillion"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {IDEAS.map((idea) => (
            <button
              key={idea}
              onClick={() => setPrompt(idea)}
              className="border border-ink/15 px-2 py-1 font-body text-xs italic text-sage transition-colors hover:border-vermillion hover:text-vermillion"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>

      {/* Style */}
      <div>
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
          02 — House Style
        </span>
        <div className="grid grid-cols-1 gap-px border border-ink/20 bg-ink/20">
          {STYLE_PRESETS.map((s) => {
            const active = s.id === styleId;
            return (
              <button
                key={s.id}
                onClick={() => setStyleId(s.id)}
                className={`flex items-center justify-between px-3 py-2 text-left font-body text-sm transition-colors ${
                  active
                    ? 'bg-ink text-paper'
                    : 'bg-paper text-ink hover:bg-stone/40'
                }`}
              >
                <span>{s.name}</span>
                {active && (
                  <span className="font-mono text-[10px] text-vermillion">
                    ✦ set
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Format */}
      <div>
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
          03 — Plate Format
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {SIZES.map((s) => {
            const active = s.id === size;
            return (
              <button
                key={s.id}
                onClick={() => setSize(s.id)}
                className={`border px-2 py-2.5 text-center transition-colors ${
                  active
                    ? 'border-vermillion bg-vermillion/10'
                    : 'border-ink/20 hover:border-ink/45'
                }`}
              >
                <span className="block font-display text-sm">{s.label}</span>
                <span className="font-mono text-[10px] text-ink/45">
                  {s.ratio}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality */}
      <div>
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
          04 — Press Quality
        </span>
        <div className="flex border border-ink/20">
          {QUALITIES.map((q, i) => {
            const active = q.id === quality;
            return (
              <button
                key={q.id}
                onClick={() => setQuality(q.id)}
                className={`flex-1 py-2 font-body text-sm transition-colors ${
                  i > 0 ? 'border-l border-ink/20' : ''
                } ${active ? 'bg-ink text-paper' : 'hover:bg-stone/40'}`}
              >
                {q.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate */}
      <button
        onClick={onGenerate}
        disabled={loading || !prompt.trim()}
        className="group relative overflow-hidden border border-ink bg-ink py-4 font-display text-lg font-semibold text-paper transition-all hover:bg-vermillion hover:border-vermillion disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="relative z-10">
          {loading
            ? 'Pressing the plate…'
            : quotaReached
              ? 'Upgrade to commission more'
              : 'Commission Illustration'}
        </span>
      </button>
    </aside>
  );
}
