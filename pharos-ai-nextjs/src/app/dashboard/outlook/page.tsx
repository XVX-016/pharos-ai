'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchOutlooks } from '@/store/slices/outlookSlice';
import { TopicSidebar } from '@/components/dashboard/TopicSidebar';
import { useRouter } from 'next/navigation';
import { Clock, Globe, FileText, ArrowRight } from 'lucide-react';

const BORDER   = '#e2e8f0';
const TEXT     = '#0f172a';
const TEXT2    = '#64748b';
const TEXT3    = '#94a3b8';
const BG_LIGHT = '#f8fafc';
const RED      = '#dd4545';

export default function OutlookListPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const { outlooks, loading, pagination } = useAppSelector(s => s.outlook);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedId, setSelectedId]       = useState<string | null>(null);

  useEffect(() => { dispatch(fetchOutlooks({ limit: 20, offset: 0 })); }, [dispatch]);

  const selected = outlooks.find(o => o.id === selectedId) ?? null;

  return (
    <>
      <TopicSidebar selected={selectedTopic} onSelect={setSelectedTopic} />

      {/* ── List pane ─────────────────────────────────────── */}
      <div style={{
        width: 340, minWidth: 340, flexShrink: 0,
        borderRight: `1px solid ${BORDER}`,
        background: 'white',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: `2px solid ${RED}`,
          background: BG_LIGHT,
        }}>
          <div className="news-meta" style={{ fontSize: 10, color: TEXT3, marginBottom: 2 }}>Intelligence Briefings</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="news-headline" style={{ fontSize: 16, color: TEXT }}>DAILY OUTLOOKS</div>
            <span className="news-meta" style={{ fontSize: 10, color: TEXT3 }}>{pagination?.total ?? 0} total</span>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading.list && outlooks.length === 0 && (
            <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 12, color: TEXT3, fontFamily: 'Arial, sans-serif' }}>
              Loading outlooks…
            </div>
          )}
          {outlooks.map(o => {
            const isOn = selectedId === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setSelectedId(isOn ? null : o.id)}
                style={{
                  width: '100%', textAlign: 'left', display: 'block',
                  padding: '12px 16px',
                  borderLeft: `4px solid ${isOn ? RED : 'transparent'}`,
                  borderTop: 'none', borderRight: 'none',
                  borderBottom: `1px solid ${BORDER}`,
                  background: isOn ? '#fef2f2' : 'white',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.08s',
                }}
                onMouseEnter={e => { if (!isOn) (e.currentTarget as HTMLElement).style.background = BG_LIGHT; }}
                onMouseLeave={e => { if (!isOn) (e.currentTarget as HTMLElement).style.background = 'white'; }}
              >
                {/* Topic badge + date */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span className="news-meta" style={{
                    fontSize: 9, padding: '2px 6px', borderRadius: 2,
                    background: isOn ? RED : '#1e293b', color: 'white',
                  }}>
                    {o.topic}
                  </span>
                  <span style={{ fontSize: 11, color: TEXT3, fontFamily: 'Arial, sans-serif' }}>{o.date}</span>
                </div>

                {/* Title */}
                <p className="news-headline" style={{
                  fontSize: 13, color: TEXT, lineHeight: 1.35, marginBottom: 4,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {o.title}
                </p>

                {/* Summary */}
                <p className="news-body" style={{
                  fontSize: 12, color: TEXT2, lineHeight: 1.4,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {o.summary}
                </p>

                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 5 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: TEXT3, fontFamily: 'Arial, sans-serif' }}>
                    <Clock size={10} strokeWidth={1.5} />{o.readTime}
                  </span>
                  {o.sourceCount != null && (
                    <span style={{ fontSize: 11, color: TEXT3, fontFamily: 'Arial, sans-serif' }}>{o.sourceCount} sources</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Detail pane ───────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!selected ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <FileText size={44} style={{ color: '#e2e8f0' }} strokeWidth={1} />
            <p className="news-meta" style={{ fontSize: 11, color: TEXT3 }}>Select an outlook to read</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div style={{
              padding: '10px 20px', flexShrink: 0,
              borderBottom: `1px solid ${BORDER}`,
              background: BG_LIGHT,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span className="news-meta" style={{
                fontSize: 10, padding: '3px 8px', borderRadius: 2,
                background: RED, color: 'white',
              }}>
                {selected.topic}
              </span>
              <span style={{ fontSize: 12, color: TEXT3, fontFamily: 'Arial, sans-serif' }}>{selected.date}</span>
              <div style={{ marginLeft: 'auto' }}>
                <button
                  onClick={() => router.push(`/outlook/${selected.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 2,
                    background: '#0f172a', border: 'none',
                    fontSize: 11, fontFamily: 'Arial, sans-serif', fontWeight: 700,
                    color: 'white', cursor: 'pointer',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}
                >
                  Full Briefing <ArrowRight size={12} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '28px 36px' }}>
                {/* Tags */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span className="news-meta" style={{ fontSize: 10, padding: '3px 8px', borderRadius: 2, background: RED, color: 'white' }}>
                    {selected.topic}
                  </span>
                  {selected.confidenceScore != null && (
                    <span className="news-meta" style={{ fontSize: 10, padding: '3px 8px', borderRadius: 2, background: '#15803d', color: 'white' }}>
                      {Math.round(selected.confidenceScore * 100)}% CONFIDENCE
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="news-headline" style={{
                  fontSize: 26, color: TEXT, lineHeight: 1.2, marginBottom: 12,
                }}>
                  {selected.title}
                </h1>

                {/* Meta */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
                  paddingBottom: 16, marginBottom: 20,
                  borderBottom: `1px solid ${BORDER}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: TEXT2, fontFamily: 'Arial, sans-serif' }}>
                    <Clock size={12} strokeWidth={1.5} />
                    {selected.date} · {selected.readTime}
                  </div>
                  {selected.regions?.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: TEXT2, fontFamily: 'Arial, sans-serif' }}>
                      <Globe size={12} strokeWidth={1.5} />
                      {selected.regions.join(', ')}
                    </div>
                  )}
                  {selected.sourceCount != null && (
                    <span style={{ fontSize: 12, color: TEXT2, fontFamily: 'Arial, sans-serif' }}>{selected.sourceCount} sources</span>
                  )}
                </div>

                {/* Summary */}
                <div className="news-meta" style={{ fontSize: 10, color: TEXT3, marginBottom: 10 }}>Executive Summary</div>
                <div style={{ borderLeft: `4px solid ${RED}`, paddingLeft: 16, marginBottom: 28 }}>
                  <p className="news-body" style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.7 }}>
                    {selected.summary}
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => router.push(`/outlook/${selected.id}`)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 16px', borderRadius: 2,
                    background: '#0f172a', border: 'none',
                    fontSize: 12, fontFamily: 'Arial, sans-serif', fontWeight: 700,
                    color: 'white', cursor: 'pointer',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}
                >
                  Read Full Intelligence Briefing <ArrowRight size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
