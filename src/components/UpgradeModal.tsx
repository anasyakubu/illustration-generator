import { useState } from 'react';
import {
  openUpgradeCheckout,
  hasFlwKey,
  FREE_LIMIT,
  PRO_LIMIT,
  UPGRADE_AMOUNT,
  UPGRADE_CURRENCY,
} from '../lib/flutterwave';

interface Props {
  open: boolean;
  onClose: () => void;
  onUpgraded: () => void;
}

export default function UpgradeModal({ open, onClose, onUpgraded }: Props) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function handlePay() {
    setError(null);
    setBusy(true);
    openUpgradeCheckout({
      email,
      onSuccess: () => {
        setBusy(false);
        onUpgraded();
      },
      onCancel: () => setBusy(false),
      onError: (msg) => {
        setBusy(false);
        setError(msg);
      },
    });
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 px-5"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="grain w-full max-w-md animate-fade-up border border-ink bg-paper p-7 shadow-[0_30px_70px_-20px_rgba(22,19,16,0.7)]"
      >
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-vermillion">
            Subscription
          </span>
          <button
            onClick={onClose}
            className="font-mono text-sm text-ink/50 hover:text-ink"
          >
            ✕
          </button>
        </div>

        <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
          The press has cooled.
        </h2>
        <p className="mt-2 font-body text-base italic text-sage">
          You have used all {FREE_LIMIT} complimentary commissions. Upgrade your
          patronage to keep the plates turning.
        </p>

        <div className="my-6 border-y border-ink/15 py-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-xl font-semibold">
                Patron's Upgrade
              </p>
              <p className="font-body text-sm text-ink/65">
                Raises your quota to {PRO_LIMIT} commissions.
              </p>
            </div>
            <p className="font-display text-3xl font-semibold text-vermillion">
              {UPGRADE_CURRENCY}
              {UPGRADE_AMOUNT.toLocaleString()}
            </p>
          </div>
        </div>

        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
          Email for receipt
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-ink/20 bg-transparent px-3 py-2.5 font-body text-base outline-none focus:border-vermillion"
        />

        {error && (
          <p className="mt-3 font-body text-sm text-vermillion">{error}</p>
        )}
        {!hasFlwKey() && (
          <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink/55">
            Setup — add <code>VITE_FLW_PUBLIC_KEY=FLWPUBK-...</code> to your{' '}
            <code>.env</code> to enable live checkout.
          </p>
        )}

        <button
          onClick={handlePay}
          disabled={!validEmail || busy}
          className="mt-5 w-full border border-ink bg-ink py-3.5 font-display text-lg font-semibold text-paper transition-colors hover:bg-vermillion hover:border-vermillion disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? 'Opening checkout…' : 'Pay with Flutterwave'}
        </button>
        <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-ink/40">
          Secured by Flutterwave · card · transfer · ussd
        </p>
      </div>
    </div>
  );
}
