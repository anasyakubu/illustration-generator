import { useState } from 'react';
import Masthead from './components/Masthead';
import ComposePanel from './components/ComposePanel';
import PlateCanvas from './components/PlateCanvas';
import Archive from './components/Archive';
import UpgradeModal from './components/UpgradeModal';
import { STYLE_PRESETS, type Plate } from './lib/presets';
import {
  generateIllustration,
  hasApiKey,
  type ImageSize,
  type Quality,
} from './lib/openai';
import { FREE_LIMIT, PRO_LIMIT } from './lib/flutterwave';
import { useSeo } from './lib/seo';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [styleId, setStyleId] = useState('risograph');
  const [size, setSize] = useState<ImageSize>('1024x1024');
  const [quality, setQuality] = useState<Quality>('medium');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plates, setPlates] = useState<Plate[]>([]);
  const [current, setCurrent] = useState<Plate | null>(null);

  // Quota state
  const [used, setUsed] = useState(0);
  const [pro, setPro] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Runtime SEO — reflect the current plate in <title> when one is open
  useSeo({
    title: current
      ? `“${current.prompt.slice(0, 50)}” — The Illustration Atelier`
      : 'The Illustration Atelier — AI Illustration Generator',
    description: current
      ? `${current.prompt} — rendered in ${current.styleName} style by The Illustration Atelier.`
      : 'A small press for synthetic pictures. Compose a brief, choose a house style, and commission a fine AI illustration. Powered by OpenAI.',
  });

  const limit = pro ? PRO_LIMIT : FREE_LIMIT;
  const quotaReached = used >= limit;

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;
    if (quotaReached) {
      setModalOpen(true);
      return;
    }
    setLoading(true);
    setError(null);

    const style = STYLE_PRESETS.find((s) => s.id === styleId)!;
    const fullPrompt = style.modifier
      ? `${prompt.trim()}, ${style.modifier}`
      : prompt.trim();

    try {
      const result = await generateIllustration({
        prompt: fullPrompt,
        size,
        quality,
      });
      const plate: Plate = {
        id: crypto.randomUUID(),
        url: result.url,
        prompt: prompt.trim(),
        styleName: style.name,
        size,
        createdAt: Date.now(),
      };
      setPlates((prev) => [plate, ...prev]);
      setCurrent(plate);
      setUsed((n) => n + 1); // only count successful commissions
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleUpgraded() {
    setPro(true);
    setModalOpen(false);
    setError(null);
  }

  return (
    <div className="grain min-h-full">
      <a href="#main" className="sr-only focusable">
        Skip to main content
      </a>
      <Masthead
        used={used}
        limit={limit}
        pro={pro}
        onUpgrade={() => setModalOpen(true)}
      />

      {!hasApiKey() && (
        <div className="border-b border-vermillion/40 bg-vermillion/10">
          <div className="mx-auto max-w-[1400px] px-6 py-2.5 md:px-10">
            <p className="font-mono text-[11px] text-ink/75">
              <span className="font-semibold text-vermillion">Setup —</span>{' '}
              create a <code>.env</code> file with{' '}
              <code>VITE_OPENAI_API_KEY=sk-...</code> then restart the dev
              server to enable the press.
            </p>
          </div>
        </div>
      )}

      <main id="main" className="mx-auto max-w-[1400px] px-6 py-8 md:px-10 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[360px_1fr]">
          <div className="flex flex-col gap-5">
            <ComposePanel
              prompt={prompt}
              setPrompt={setPrompt}
              styleId={styleId}
              setStyleId={setStyleId}
              size={size}
              setSize={setSize}
              quality={quality}
              setQuality={setQuality}
              loading={loading}
              quotaReached={quotaReached}
              onGenerate={handleGenerate}
            />
            {quotaReached && (
              <button
                onClick={() => setModalOpen(true)}
                className="border border-vermillion bg-vermillion/10 px-4 py-3 text-left"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-vermillion">
                  Quota reached
                </span>
                <p className="mt-1 font-body text-sm text-ink/80">
                  {pro
                    ? `All ${PRO_LIMIT} commissions used for this session.`
                    : `Upgrade with Flutterwave to raise your limit to ${PRO_LIMIT}.`}
                </p>
              </button>
            )}
          </div>
          <PlateCanvas loading={loading} error={error} current={current} />
        </div>

        <div className="mt-12">
          <Archive
            plates={plates}
            currentId={current?.id ?? null}
            onSelect={setCurrent}
            onClear={() => {
              setPlates([]);
              setCurrent(null);
            }}
          />
        </div>
      </main>

      <footer className="border-t border-ink/15">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 md:px-10">
          <span>The Illustration Atelier</span>
          <span>It's Not Magic, It's Programming</span>
        </div>
      </footer>

      <UpgradeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpgraded={handleUpgraded}
      />
    </div>
  );
}
