// Flutterwave inline checkout helper.
// FlutterwaveCheckout is provided globally by the v3.js script in index.html.
// Public key is read from Vite env: VITE_FLW_PUBLIC_KEY.

const FLW_PUBLIC_KEY = import.meta.env.VITE_FLW_PUBLIC_KEY as
  | string
  | undefined;

/** Free generations before an upgrade is required. */
export const FREE_LIMIT = 3;
/** Generations available after a successful upgrade. */
export const PRO_LIMIT = 10;
/** Price of the upgrade. */
export const UPGRADE_AMOUNT = 2000;
export const UPGRADE_CURRENCY = 'NGN';

interface FlwResponse {
  status: string; // "successful" | "completed" | "cancelled" ...
  transaction_id?: number;
  tx_ref: string;
}

interface FlwConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: { email: string; name?: string };
  customizations: { title: string; description: string };
  callback: (res: FlwResponse) => void;
  onclose: () => void;
}

declare global {
  interface Window {
    FlutterwaveCheckout?: (config: FlwConfig) => { close: () => void };
  }
}

export function hasFlwKey(): boolean {
  return Boolean(FLW_PUBLIC_KEY && FLW_PUBLIC_KEY.startsWith('FLWPUBK'));
}

export interface UpgradeOptions {
  email: string;
  onSuccess: (txRef: string, transactionId?: number) => void;
  onCancel: () => void;
  onError: (message: string) => void;
}

/** Opens the Flutterwave modal. Resolves via the callbacks in opts. */
export function openUpgradeCheckout(opts: UpgradeOptions): void {
  if (!hasFlwKey()) {
    opts.onError(
      'No Flutterwave key found. Add VITE_FLW_PUBLIC_KEY to .env and restart.',
    );
    return;
  }
  if (typeof window.FlutterwaveCheckout !== 'function') {
    opts.onError('Flutterwave checkout script failed to load.');
    return;
  }

  const txRef = `atelier-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  window.FlutterwaveCheckout({
    public_key: FLW_PUBLIC_KEY!,
    tx_ref: txRef,
    amount: UPGRADE_AMOUNT,
    currency: UPGRADE_CURRENCY,
    payment_options: 'card,banktransfer,ussd',
    customer: { email: opts.email, name: 'Atelier Patron' },
    customizations: {
      title: 'The Illustration Atelier',
      description: `Press upgrade — ${PRO_LIMIT} commissions`,
    },
    callback: (res) => {
      const ok =
        res.status === 'successful' || res.status === 'completed';
      // IMPORTANT: in production, verify res.transaction_id server-side
      // against Flutterwave's /transactions/:id/verify endpoint before
      // granting the upgrade. Browser-side status alone is spoofable.
      if (ok) {
        opts.onSuccess(res.tx_ref, res.transaction_id);
      } else {
        opts.onError('Payment was not completed.');
      }
    },
    onclose: () => opts.onCancel(),
  });
}
