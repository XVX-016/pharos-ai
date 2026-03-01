'use client';
import { useState } from 'react';
import { ExternalLink, ChevronDown } from 'lucide-react';
import type { PredictionMarket } from '@/app/api/polymarket/route';
import { PriceChart } from './PriceChart';
import { SubMarketTable } from './SubMarketTable';
import { fmtVol, fmtDate, probColor, probBg, spreadColor, statusLabel, getLeadProb, COL } from './utils';

interface Props {
  market: PredictionMarket;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function MarketRow({ market, rank, isExpanded, onToggle }: Props) {
  const [selectedSubId, setSelectedSubId] = useState(
    market.yesTokenId
      ? market.subMarkets.find(s => s.yesTokenId === market.yesTokenId)?.id ?? market.subMarkets[0]?.id ?? ''
      : '',
  );

  const isGroup  = market.subMarkets.length > 1;
  const prob     = getLeadProb(market);
  const color    = probColor(prob);
  const bg       = probBg(prob);
  const status   = statusLabel(market);
  const isBinary = market.outcomes.length === 2;
  const chartTokenId = isGroup
    ? (market.subMarkets.find(s => s.id === selectedSubId)?.yesTokenId ?? market.yesTokenId)
    : market.yesTokenId;

  return (
    <>
      <div role="button" tabIndex={0} onClick={onToggle} onKeyDown={e => e.key === 'Enter' && onToggle()}
        style={{
          display: 'grid', gridTemplateColumns: COL, alignItems: 'center', height: 44,
          borderBottom: '1px solid var(--bd)', cursor: 'pointer',
          background: isExpanded ? 'var(--bg-2)' : 'transparent', transition: 'background 0.1s',
        }}
        onMouseEnter={e => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = 'rgba(56,62,71,0.45)'; }}
        onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
      >
        <div style={{ paddingLeft: 14, fontSize: 10, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)', fontWeight: 700 }}>{rank}</div>
        <div style={{ paddingRight: 20, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {market.title}
          </div>
          {isGroup && (
            <span style={{ flexShrink: 0, padding: '1px 5px', background: 'rgba(76,144,240,0.1)', border: '1px solid rgba(76,144,240,0.25)', borderRadius: 2, fontSize: 8, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, color: 'var(--blue-l)', letterSpacing: '0.06em' }}>
              {market.subMarkets.length}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 12 }}>
          <div style={{ flex: 1, height: 4, background: 'var(--bg-3)', borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ width: `${prob * 100}%`, height: '100%', background: color, borderRadius: 1 }} />
          </div>
          <div style={{ fontSize: 12, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, color, background: bg, padding: '1px 5px', borderRadius: 2, minWidth: 40, textAlign: 'right' }}>
            {Math.round(prob * 100)}%
          </div>
        </div>
        <div style={{ fontSize: 11, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t2)', textAlign: 'right', paddingRight: 12 }}>{fmtVol(market.volume)}</div>
        <div style={{ fontSize: 11, fontFamily: 'SFMono-Regular, Menlo, monospace', color: market.volume24hr > 0 ? '#23A26D' : 'var(--t4)', textAlign: 'right', paddingRight: 12 }}>
          {market.volume24hr > 0 ? fmtVol(market.volume24hr) : '—'}
        </div>
        <div style={{ fontSize: 10, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t3)', textAlign: 'right', paddingRight: 12 }}>{fmtDate(market.endDate)}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 8 }}>
          <span style={{ padding: '2px 5px', background: status.bg, border: `1px solid ${status.border}`, borderRadius: 2, fontSize: 8, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, color: status.color, letterSpacing: '0.06em' }}>
            {status.label}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--t4)' }}>
          <ChevronDown size={12} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
        </div>
      </div>

      {isExpanded && (
        <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--bd)', padding: '14px 50px 18px 50px' }}>
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flexShrink: 0 }}>
              {isGroup && (
                <div style={{ fontSize: 8, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)', letterSpacing: '0.08em', marginBottom: 6 }}>
                  CHART: {market.subMarkets.find(s => s.id === selectedSubId)?.groupItemTitle ?? '—'}
                </div>
              )}
              <PriceChart yesTokenId={chartTokenId} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 200 }}>
              {market.description && (
                <p style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.7, maxWidth: 600 }}>{market.description}</p>
              )}
              {!isBinary && market.outcomes.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxWidth: 400 }}>
                  <div style={{ fontSize: 8, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)', letterSpacing: '0.08em' }}>OUTCOMES</div>
                  {market.outcomes.slice(0, 6).map((outcome, i) => {
                    const p = market.prices[i] ?? 0;
                    const c = probColor(p);
                    return (
                      <div key={outcome} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t2)', width: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{outcome}</span>
                        <div style={{ flex: 1, height: 3, background: 'var(--bg-3)', borderRadius: 1, overflow: 'hidden', maxWidth: 180 }}>
                          <div style={{ width: `${p * 100}%`, height: '100%', background: c }} />
                        </div>
                        <span style={{ fontSize: 10, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, color: c, width: 32, textAlign: 'right', flexShrink: 0 }}>{Math.round(p * 100)}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 160, alignItems: 'flex-end' }}>
              <div style={{ textAlign: 'right', width: '100%' }}>
                <div style={{ fontSize: 8, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)', letterSpacing: '0.06em', marginBottom: 4 }}>ORDER BOOK</div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', fontFamily: 'SFMono-Regular, Menlo, monospace', fontSize: 11 }}>
                  {[
                    { label: 'BID', val: market.bestBid > 0 ? `${Math.round(market.bestBid * 100)}¢` : '—', color: '#23A26D' },
                    { label: 'ASK', val: market.bestAsk > 0 ? `${Math.round(market.bestAsk * 100)}¢` : '—', color: '#E76A6E' },
                    { label: 'SPREAD', val: market.spread > 0 ? `${(market.spread * 100).toFixed(1)}¢` : '—', color: spreadColor(market.spread) },
                  ].map(({ label, val, color: c }) => (
                    <div key={label} style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 7, color: 'var(--t4)', letterSpacing: '0.06em' }}>{label}</div>
                      <div style={{ fontWeight: 700, color: c }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', width: '100%' }}>
                {[
                  { label: 'LIQUIDITY', val: fmtVol(market.liquidity) },
                  { label: '24H VOL',   val: fmtVol(market.volume24hr) },
                  { label: '7D VOL',    val: fmtVol(market.volume1wk) },
                  { label: '1MO VOL',   val: fmtVol(market.volume1mo) },
                  ...(market.openInterest > 0 ? [{ label: 'OPEN INT', val: fmtVol(market.openInterest) }] : []),
                  { label: 'COMPETITIVE', val: `${(market.competitive * 100).toFixed(0)}%` },
                ].map(({ label, val }) => (
                  <div key={label} style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 7, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)', letterSpacing: '0.06em' }}>{label}</div>
                    <div style={{ fontSize: 11, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, color: 'var(--t1)' }}>{val}</div>
                  </div>
                ))}
              </div>
              {market.startDate && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 7, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)', letterSpacing: '0.06em' }}>OPENED</div>
                  <div style={{ fontSize: 10, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t3)' }}>{fmtDate(market.startDate)}</div>
                </div>
              )}
              <a href={market.polyUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{ display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', color: 'var(--blue-l)', fontSize: 9, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, letterSpacing: '0.08em', padding: '4px 8px', border: '1px solid rgba(76,144,240,0.3)', borderRadius: 2, background: 'rgba(45,114,210,0.08)' }}>
                <ExternalLink size={10} /> POLYMARKET ↗
              </a>
            </div>
          </div>

          {isGroup && (
            <div style={{ marginTop: 16, borderTop: '1px solid var(--bd)', paddingTop: 12 }}>
              <div style={{ fontSize: 8, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)', letterSpacing: '0.10em', marginBottom: 6 }}>
                {market.subMarkets.length} SUB-MARKETS — CLICK ROW TO VIEW CHART
              </div>
              <SubMarketTable subMarkets={market.subMarkets} selectedId={selectedSubId}
                onSelect={id => setSelectedSubId(id)} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
