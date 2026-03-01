'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { PredictionMarket } from '@/app/api/polymarket/route';
import type { MarketGroup } from '@/data/predictionGroups';
import { MarketRow } from './MarketRow';
import { fmtVol, getLeadProb } from './utils';

interface Props {
  group: MarketGroup;
  markets: PredictionMarket[];
  expandedId: string | null;
  onToggle: (id: string) => void;
  globalRankOffset: number;
  sortBy: 'volume' | 'volume24hr' | 'probability';
}

export function GroupSection({ group, markets, expandedId, onToggle, globalRankOffset, sortBy }: Props) {
  const [open, setOpen] = useState(true);
  if (markets.length === 0) return null;

  const groupVol = markets.reduce((s, m) => s + m.volume, 0);
  const sorted   = [...markets].sort((a, b) => {
    if (sortBy === 'volume')     return b.volume - a.volume;
    if (sortBy === 'volume24hr') return b.volume24hr - a.volume24hr;
    return getLeadProb(b) - getLeadProb(a);
  });

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          style={{
            height: 30, display: 'flex', alignItems: 'center', padding: '0 14px',
            background: group.bg, borderBottom: `1px solid ${group.border}`,
            borderLeft: `3px solid ${group.color}`, cursor: 'pointer', gap: 8,
          }}
        >
          {open
            ? <ChevronDown  size={11} style={{ color: group.color, flexShrink: 0 }} />
            : <ChevronRight size={11} style={{ color: group.color, flexShrink: 0 }} />}
          <span style={{ fontSize: 9, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, color: group.color, letterSpacing: '0.10em' }}>
            {group.label}
          </span>
          <span style={{ fontSize: 9, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)', letterSpacing: '0.04em' }}>
            {group.description}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 9, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)' }}>
              {markets.length} {markets.length === 1 ? 'MARKET' : 'MARKETS'}
            </span>
            <span style={{ fontSize: 9, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t3)', fontWeight: 700 }}>
              {fmtVol(groupVol)} VOL
            </span>
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        {sorted.map((market, i) => (
          <MarketRow
            key={market.id}
            market={market}
            rank={globalRankOffset + i + 1}
            isExpanded={expandedId === market.id}
            onToggle={() => onToggle(market.id)}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
