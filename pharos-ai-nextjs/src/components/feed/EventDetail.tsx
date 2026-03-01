'use client';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IntelTabBar, TabsContent } from '@/components/shared/IntelTabs';
import { SectionDivider } from '@/components/shared/SectionDivider';
import XPostCard from '@/components/shared/XPostCard';
import { getPostsForEvent } from '@/data/iranXPosts';
import type { IntelEvent } from '@/data/iranEvents';

const SEV_C: Record<string, string> = {
  CRITICAL: 'var(--danger)', HIGH: 'var(--warning)', STANDARD: 'var(--info)',
};
const TIER_C: Record<number, string> = { 1: 'var(--success)', 2: 'var(--warning)', 3: 'var(--t4)' };
const TIER_L: Record<number, string> = { 1: 'T1', 2: 'T2', 3: 'T3' };
const STANCE_C: Record<string, string> = {
  SUPPORTING: 'var(--success)', OPPOSING: 'var(--danger)',
  NEUTRAL: 'var(--t4)', UNKNOWN: 'var(--t4)',
};

function MetaChip({ label, val }: { label: string; val: string }) {
  return (
    <div>
      <div className="label" style={{ fontSize: 8, marginBottom: 1 }}>{label}</div>
      <span className="mono" style={{ fontSize: 10, color: 'var(--t1)' }}>{val}</span>
    </div>
  );
}

interface Props {
  event: IntelEvent;
  tab: 'report' | 'signals';
  onTabChange: (t: 'report' | 'signals') => void;
}

export function EventDetail({ event, tab, onTabChange }: Props) {
  const sc     = SEV_C[event.severity] ?? 'var(--info)';
  const xPosts = getPostsForEvent(event.id);

  const tabs = [
    { value: 'report'  as const, label: 'INTEL REPORT' },
    { value: 'signals' as const, label: `𝕏 SIGNALS${xPosts.length > 0 ? ` (${xPosts.length})` : ''}` },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '10px 20px', borderBottom: '1px solid var(--bd)',
        background: 'var(--bg-2)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '2px 8px', border: `1px solid ${sc}`, background: sc + '18',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: sc }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: sc, letterSpacing: '0.08em' }}>
              {event.severity}
            </span>
          </div>
          <span className="label" style={{ color: 'var(--t3)', fontSize: 8 }}>{event.type}</span>
          {event.verified && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <CheckCircle size={9} style={{ color: 'var(--success)' }} strokeWidth={2} />
              <span className="label" style={{ fontSize: 8, color: 'var(--success)' }}>VERIFIED</span>
            </div>
          )}
        </div>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.25, marginBottom: 8 }}>
          {event.title}
        </h1>
        <div style={{ display: 'flex', gap: 20 }}>
          <MetaChip label="TIMESTAMP"
            val={new Date(event.timestamp).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'} />
          <MetaChip label="LOCATION" val={event.location} />
          <MetaChip label="SOURCES"  val={String(event.sources.length)} />
        </div>
      </div>

      {/* Tabs */}
      <IntelTabBar value={tab} onValueChange={onTabChange} tabs={tabs}>
        <TabsContent value="report" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ScrollArea style={{ height: '100%' }}>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ marginBottom: 22 }}>
                <SectionDivider label="EXECUTIVE SUMMARY" />
                <div style={{ borderLeft: `3px solid ${sc}`, paddingLeft: 14 }}>
                  <p style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.7 }}>{event.summary}</p>
                </div>
              </div>

              <div style={{ marginBottom: 22 }}>
                <SectionDivider label="INTELLIGENCE REPORT" />
                <div style={{ fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.7 }}>
                  {event.fullContent.split('\n\n').map((p, i) => (
                    <p key={i} style={{ marginBottom: 12, color: i === 0 ? 'var(--t1)' : 'var(--t2)' }}>{p}</p>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 22 }}>
                <SectionDivider label={`SOURCES (${event.sources.length})`} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {event.sources.map((src, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '6px 10px', border: '1px solid var(--bd)',
                    }}>
                      <span style={{
                        fontSize: 8, fontWeight: 700, padding: '1px 5px',
                        background: TIER_C[src.tier] + '22', color: TIER_C[src.tier],
                      }}>
                        {TIER_L[src.tier]}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--t1)', flex: 1 }}>{src.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 50, height: 3, background: 'var(--bd)' }}>
                          <div style={{
                            width: `${src.reliability}%`, height: '100%',
                            background: src.reliability > 90 ? 'var(--success)'
                              : src.reliability > 75 ? 'var(--warning)' : 'var(--danger)',
                          }} />
                        </div>
                        <span className="mono" style={{ fontSize: 9, color: 'var(--t3)', minWidth: 26 }}>
                          {src.reliability}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {event.actorResponses.length > 0 && (
                <div style={{ marginBottom: 22 }}>
                  <SectionDivider label="ACTOR RESPONSES" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {event.actorResponses.map((r, i) => {
                      const stC = STANCE_C[r.stance] ?? 'var(--t2)';
                      return (
                        <Link key={i} href={`/dashboard/actors?actor=${r.actorId}`}
                          style={{ textDecoration: 'none' }}>
                          <div style={{
                            padding: '8px 12px', border: '1px solid var(--bd)',
                            borderLeft: `3px solid ${stC}`, cursor: 'pointer',
                          }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-3)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                          >
                            <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)' }}>{r.actorName}</span>
                              <span style={{
                                fontSize: 8, padding: '1px 5px',
                                background: stC + '18', color: stC, fontWeight: 700, letterSpacing: '.05em',
                              }}>{r.stance}</span>
                              <span className="label" style={{ fontSize: 8, marginLeft: 'auto', color: 'var(--t3)' }}>{r.type}</span>
                              <ArrowRight size={9} style={{ color: 'var(--t3)' }} strokeWidth={1.5} />
                            </div>
                            <p style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.5, fontStyle: 'italic' }}>
                              "{r.statement}"
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="signals" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ScrollArea style={{ height: '100%' }}>
            <div style={{ padding: '12px 16px' }}>
              {xPosts.length === 0 ? (
                <div style={{ padding: 48, textAlign: 'center' }}>
                  <span style={{ fontSize: 20, color: 'var(--t3)' }}>𝕏</span>
                  <p className="label" style={{ color: 'var(--t3)', marginTop: 8 }}>
                    No signals indexed for this event
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 10 }}>
                    <span className="label" style={{ fontSize: 8 }}>
                      {xPosts.length} POSTS · PHAROS-CURATED · CHRONOLOGICAL
                    </span>
                  </div>
                  {xPosts.map(p => <XPostCard key={p.id} post={p as import('@/data/iranXPosts').XPost} />)}
                </>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </IntelTabBar>
    </div>
  );
}
