import type { PredictionMarket, SubMarket } from '@/app/api/polymarket/route';

export function fmtVol(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}
export function fmtDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }).toUpperCase();
}
export function probColor(p: number) {
  if (p >= 0.65) return '#23A26D';
  if (p >= 0.50) return '#2D72D2';
  if (p >= 0.35) return '#EC9A3C';
  return '#E76A6E';
}
export function probBg(p: number) {
  if (p >= 0.65) return 'rgba(35,162,109,0.12)';
  if (p >= 0.50) return 'rgba(45,114,210,0.12)';
  if (p >= 0.35) return 'rgba(236,154,60,0.12)';
  return 'rgba(231,106,110,0.12)';
}
export function getLeadProb(m: PredictionMarket | SubMarket): number {
  const ltp = (m as PredictionMarket).lastTradePrice;
  if (ltp && ltp > 0) return ltp;
  const yesIdx = m.outcomes.findIndex(o => o.toUpperCase() === 'YES');
  return yesIdx >= 0 ? (m.prices[yesIdx] ?? 0) : (m.prices[0] ?? 0);
}
export function spreadColor(s: number) {
  if (s < 0.02) return '#23A26D';
  if (s < 0.07) return '#EC9A3C';
  return '#E76A6E';
}
export function statusLabel(m: PredictionMarket) {
  if (m.closed) return { label: 'CLOSED',   color: 'var(--t4)',   bg: 'rgba(92,112,128,0.12)', border: 'rgba(92,112,128,0.25)' };
  if (m.active) return { label: 'LIVE',     color: '#23A26D',     bg: 'rgba(35,162,109,0.12)', border: 'rgba(35,162,109,0.3)'  };
  return          { label: 'RESOLVED', color: 'var(--blue-l)', bg: 'var(--blue-dim)',       border: 'rgba(76,144,240,0.3)'  };
}
export const COL = '36px 1fr 120px 96px 72px 80px 64px 28px';
