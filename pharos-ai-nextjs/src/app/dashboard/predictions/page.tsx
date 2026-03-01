'use client';
import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, TrendingUp } from 'lucide-react';
import type { PredictionMarket } from '@/app/api/polymarket/route';
import { assignGroup, MARKET_GROUPS, UNCATEGORIZED_GROUP } from '@/data/predictionGroups';
import { GroupSection } from '@/components/predictions/GroupSection';
import { fmtVol, getLeadProb, COL } from '@/components/predictions/utils';

export default function PredictionsPage() {
  const [markets,        setMarkets]        = useState<PredictionMarket[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState<string | null>(null);
  const [sortBy,         setSortBy]         = useState<'volume' | 'volume24hr' | 'probability'>('volume');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [fetchedAt,      setFetchedAt]      = useState('');
  const [isRefreshing,   setIsRefreshing]   = useState(false);
  const [expandedId,     setExpandedId]     = useState<string | null>(null);

  const fetchMarkets = async () => {
    setLoading(true); setIsRefreshing(true); setError(null);
    try {
      const res  = await fetch('/api/polymarket');
      const data = await res.json() as { markets: PredictionMarket[]; fetchedAt: string; error?: string };
      if (data.error) throw new Error(data.error);
      setMarkets(data.markets);
      setFetchedAt(data.fetchedAt);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false); setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchMarkets(); }, []);

  const filtered = useMemo(() => {
    let m = markets;
    if (showActiveOnly) m = m.filter(x => x.active && !x.closed);
    return m;
  }, [markets, showActiveOnly]);

  const grouped = useMemo(() => {
    const map = new Map<string, PredictionMarket[]>();
    const allGroups = [...MARKET_GROUPS, UNCATEGORIZED_GROUP];
    for (const g of allGroups) map.set(g.id, []);
    for (const m of filtered) {
      const g = assignGroup(m.title);
      map.get(g.id)!.push(m);
    }
    return map;
  }, [filtered]);

  const rankOffsets = useMemo(() => {
    const offsets: Record<string, number> = {};
    let total = 0;
    for (const g of [...MARKET_GROUPS, UNCATEGORIZED_GROUP]) {
      offsets[g.id] = total;
      total += (grouped.get(g.id)?.length ?? 0);
    }
    return offsets;
  }, [grouped]);

  const totalVolume = markets.reduce((s, m) => s + m.volume, 0);
  const totalVol24h = markets.reduce((s, m) => s + m.volume24hr, 0);
  const activeCount = markets.filter(m => m.active && !m.closed).length;
  const lastUpdated = fetchedAt ? new Date(fetchedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—';

  const SORT_COLS: { key: typeof sortBy; label: string }[] = [
    { key: 'volume',      label: 'TOTAL VOL' },
    { key: 'volume24hr',  label: '24H VOL'   },
    { key: 'probability', label: 'PROB'       },
  ];

  return (
    <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-1)', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ height: 44, background: 'var(--bg-app)', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={14} strokeWidth={2.5} style={{ color: 'var(--blue-l)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'SFMono-Regular, Menlo, monospace', fontSize: 11, fontWeight: 700, color: 'var(--t1)', letterSpacing: '0.10em' }}>PREDICTION MARKETS</span>
          <span style={{ fontFamily: 'SFMono-Regular, Menlo, monospace', fontSize: 9, color: 'var(--t4)', letterSpacing: '0.06em' }}>VIA POLYMARKET</span>
        </div>
        <div style={{ width: 1, height: 20, background: 'var(--bd)', flexShrink: 0 }} />
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 9, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)' }}>MARKETS </span>
            <span style={{ fontSize: 11, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, color: 'var(--t1)' }}>{markets.length}</span>
            <span style={{ fontSize: 9, fontFamily: 'SFMono-Regular, Menlo, monospace', color: '#23A26D', marginLeft: 6 }}>({activeCount} LIVE)</span>
          </div>
          <div>
            <span style={{ fontSize: 9, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)' }}>TOTAL VOL </span>
            <span style={{ fontSize: 11, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, color: 'var(--t1)' }}>{fmtVol(totalVolume)}</span>
          </div>
          <div>
            <span style={{ fontSize: 9, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)' }}>24H VOL </span>
            <span style={{ fontSize: 11, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, color: totalVol24h > 0 ? '#23A26D' : 'var(--t4)' }}>{fmtVol(totalVol24h)}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 9, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)' }}>{lastUpdated}</span>
          <button onClick={fetchMarkets} disabled={loading}
            style={{ background: 'none', border: '1px solid var(--bd)', borderRadius: 2, padding: '4px 6px', cursor: loading ? 'not-allowed' : 'pointer', color: 'var(--t3)', display: 'flex', alignItems: 'center', opacity: loading ? 0.5 : 1 }}>
            <RefreshCw size={12} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Column header */}
      <div style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--bd)', flexShrink: 0, display: 'grid', gridTemplateColumns: COL, alignItems: 'center', height: 30 }}>
        <div />
        <div style={{ fontSize: 8, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)', letterSpacing: '0.08em', paddingLeft: 2 }}>MARKET</div>
        {SORT_COLS.map(col => (
          <button key={col.key} onClick={() => setSortBy(col.key)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: col.key === 'probability' ? 0 : 12, display: 'flex', justifyContent: col.key === 'probability' ? 'flex-start' : 'flex-end', alignItems: 'center' }}>
            <span style={{ fontSize: 8, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: sortBy === col.key ? 700 : 400, color: sortBy === col.key ? 'var(--blue-l)' : 'var(--t4)', letterSpacing: '0.08em' }}>
              {col.label}{sortBy === col.key ? ' ▼' : ''}
            </span>
          </button>
        ))}
        <div style={{ fontSize: 8, fontFamily: 'SFMono-Regular, Menlo, monospace', color: 'var(--t4)', letterSpacing: '0.08em', textAlign: 'right', paddingRight: 12 }}>ENDS</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 8 }}>
          <button onClick={() => setShowActiveOnly(v => !v)}
            style={{ padding: '1px 5px', background: showActiveOnly ? 'rgba(35,162,109,0.15)' : 'transparent', border: `1px solid ${showActiveOnly ? 'rgba(35,162,109,0.4)' : 'var(--bd)'}`, borderRadius: 2, cursor: 'pointer', fontSize: 7, fontFamily: 'SFMono-Regular, Menlo, monospace', fontWeight: 700, color: showActiveOnly ? '#23A26D' : 'var(--t4)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            LIVE ONLY
          </button>
        </div>
        <div />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10 }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', color: 'var(--blue)' }} />
            <span style={{ fontSize: 10, fontFamily: 'SFMono-Regular, Menlo, monospace', letterSpacing: '0.1em', color: 'var(--t4)' }}>FETCHING MARKET DATA...</span>
          </div>
        ) : error ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--danger)', fontFamily: 'SFMono-Regular, Menlo, monospace', fontSize: 11 }}>
            ERROR: {error}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--t4)', fontFamily: 'SFMono-Regular, Menlo, monospace', fontSize: 11, letterSpacing: '0.1em' }}>
            NO MARKETS FOUND
          </div>
        ) : (
          [...MARKET_GROUPS, UNCATEGORIZED_GROUP].map(group => (
            <GroupSection
              key={group.id}
              group={group}
              markets={grouped.get(group.id) ?? []}
              expandedId={expandedId}
              onToggle={id => setExpandedId(expandedId === id ? null : id)}
              globalRankOffset={rankOffsets[group.id] ?? 0}
              sortBy={sortBy}
            />
          ))
        )}
      </div>
    </div>
  );
}
