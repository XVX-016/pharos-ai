'use client';
import type { SubMarket, PredictionMarket } from '@/app/api/polymarket/route';
import { probColor, spreadColor, statusLabel } from './utils';

interface Props {
  subMarkets: SubMarket[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function SubMarketTable({ subMarkets, selectedId, onSelect }: Props) {
  const sorted = [...subMarkets].sort((a, b) => {
    if (a.closed !== b.closed) return a.closed ? 1 : -1;
    return (a.groupItemTitle || a.question).localeCompare(b.groupItemTitle || b.question);
  });

  const cols = '140px 70px 60px 60px 60px 80px 60px';

  return (
    <div style={{ width: '100%', marginTop: 4 }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, height: 24, borderBottom: '1px solid var(--bd)', alignItems: 'center', padding: '0 4px' }}>
        {['DATE / QUESTION', 'LAST', 'BID', 'ASK', 'SPREAD', '24H VOL', 'STATUS'].map(h => (
          <div key={h} style={{ fontSize: 7, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)', letterSpacing: '0.08em', textAlign: h === 'DATE / QUESTION' ? 'left' : 'right', paddingRight: h !== 'DATE / QUESTION' ? 8 : 0 }}>
            {h}
          </div>
        ))}
      </div>
      {sorted.map(sm => {
        const isSelected = sm.id === selectedId;
        const ltpC = probColor(sm.lastTradePrice);
        const sc   = spreadColor(sm.spread);
        const st   = statusLabel(sm as unknown as PredictionMarket);
        const label = sm.groupItemTitle || sm.question.replace(/^Will /i, '').slice(0, 30);
        return (
          <div key={sm.id} role="button" tabIndex={0}
            onClick={() => onSelect(sm.id)}
            onKeyDown={e => e.key === 'Enter' && onSelect(sm.id)}
            style={{
              display: 'grid', gridTemplateColumns: cols, height: 30,
              borderBottom: '1px solid var(--bd)', alignItems: 'center', padding: '0 4px',
              cursor: 'pointer',
              background: isSelected ? 'rgba(45,114,210,0.1)' : 'transparent',
              borderLeft: isSelected ? '2px solid var(--blue)' : '2px solid transparent',
            }}
            onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'rgba(56,62,71,0.4)'; }}
            onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
          >
            <div style={{ fontSize: 10, fontFamily: 'SFMono-Regular, Menlo, monospace', color: isSelected ? 'var(--blue-l)' : 'var(--t1)', fontWeight: isSelected ? 700 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {label}
            </div>
            <div style={{ fontSize: 11, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, color: ltpC, textAlign: 'right', paddingRight: 8 }}>
              {Math.round(sm.lastTradePrice * 100)}%
            </div>
            <div style={{ fontSize: 10, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t3)', textAlign: 'right', paddingRight: 8 }}>
              {sm.bestBid > 0 ? Math.round(sm.bestBid * 100) : '—'}
            </div>
            <div style={{ fontSize: 10, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t3)', textAlign: 'right', paddingRight: 8 }}>
              {sm.bestAsk > 0 ? Math.round(sm.bestAsk * 100) : '—'}
            </div>
            <div style={{ fontSize: 10, fontFamily: 'SFMono-Regular, Menlo, monospace', color: sc, textAlign: 'right', paddingRight: 8 }}>
              {sm.spread > 0 ? (sm.spread * 100).toFixed(1) : '—'}
            </div>
            <div style={{ fontSize: 10, fontFamily: 'SFMono-Regular, Menlo, monospace', color: sm.volume24hr > 0 ? '#23A26D' : 'var(--t4)', textAlign: 'right', paddingRight: 8 }}>
              {sm.volume24hr > 0 ? `$${(sm.volume24hr / 1000).toFixed(0)}K` : '—'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 4 }}>
              <span style={{ padding: '1px 4px', background: st.bg, border: `1px solid ${st.border}`, borderRadius: 2, fontSize: 7, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, color: st.color, letterSpacing: '0.06em' }}>
                {st.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
