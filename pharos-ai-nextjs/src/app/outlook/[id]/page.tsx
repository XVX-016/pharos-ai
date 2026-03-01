'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchOutlookDetail } from '@/store/slices/outlookSlice';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Clock, Globe, BookOpen, Calendar, Share, ArrowUpRight } from 'lucide-react';
import AnnotatedText from '@/components/shared/AnnotatedText';
import MapViewer from '@/components/shared/MapViewer';
import OutlookCalendar from '@/components/shared/OutlookCalendar';
import AIOutlookChat from '@/components/shared/AIOutlookChat';

const BORDER   = '#e2e8f0';
const TEXT     = '#0f172a';
const TEXT2    = '#475569';
const TEXT3    = '#94a3b8';
const BG_LIGHT = '#f8fafc';
const RED      = '#dd4545';

export default function OutlookDetailPage({ params }: { params: { id: string } }) {
  const dispatch  = useAppDispatch();
  const router    = useRouter();
  const { currentOutlook, loading, error } = useAppSelector(s => s.outlook);
  const [simpleEnglish, setSimpleEnglish] = useState(false);
  const [calendarOpen, setCalendarOpen]   = useState(false);

  useEffect(() => { dispatch(fetchOutlookDetail(params.id)); }, [dispatch, params.id]);

  if (loading.detail) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
      <p className="news-meta" style={{ fontSize: 11, color: TEXT3 }}>Loading briefing…</p>
    </div>
  );

  if (error.detail || !currentOutlook) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: 'white' }}>
      <p className="news-headline" style={{ fontSize: 16, color: TEXT }}>Briefing unavailable</p>
      <button
        onClick={() => dispatch(fetchOutlookDetail(params.id))}
        style={{
          padding: '8px 18px', borderRadius: 2,
          background: '#0f172a', border: 'none',
          fontSize: 11, fontFamily: 'Arial, sans-serif', fontWeight: 700,
          color: 'white', cursor: 'pointer',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}
      >
        Retry
      </button>
    </div>
  );

  const displayText = simpleEnglish
    ? currentOutlook.content.easierEnglish
    : currentOutlook.content.standard;

  return (
    <>
      {/* Article column */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'white' }}>

        {/* Toolbar */}
        <div style={{
          padding: '10px 20px', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: `2px solid ${RED}`,
          background: '#0f172a',
        }}>
          <button
            onClick={() => router.back()}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 10px', borderRadius: 2,
              background: 'rgba(255,255,255,0.08)', border: 'none',
              fontSize: 11, fontFamily: 'Arial, sans-serif', fontWeight: 600,
              color: 'rgba(255,255,255,0.75)', cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
          >
            <ChevronLeft size={14} strokeWidth={2} />
            Back
          </button>

          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)' }} />

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="news-meta" style={{
              fontSize: 10, padding: '3px 8px', borderRadius: 2,
              background: RED, color: 'white',
            }}>
              {currentOutlook.topic}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.50)', fontFamily: 'Arial, sans-serif' }}>
              {currentOutlook.date}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ToolbarBtn
              icon={<BookOpen size={12} strokeWidth={1.5} />}
              label={simpleEnglish ? 'Standard' : 'Simpler'}
              onClick={() => setSimpleEnglish(v => !v)}
              active={simpleEnglish}
            />
            <ToolbarBtn
              icon={<Calendar size={12} strokeWidth={1.5} />}
              label="Calendar"
              onClick={() => setCalendarOpen(true)}
            />
            <ToolbarBtn
              icon={<Share size={12} strokeWidth={1.5} />}
              label="Share"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Article */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '36px 48px', maxWidth: 900 }}>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span className="news-meta" style={{ fontSize: 10, padding: '3px 8px', borderRadius: 2, background: RED, color: 'white' }}>
                {currentOutlook.topic}
              </span>
              {currentOutlook.annotations?.length > 0 && (
                <span className="news-meta" style={{ fontSize: 10, padding: '3px 8px', borderRadius: 2, background: '#1e293b', color: 'white' }}>
                  Annotated
                </span>
              )}
              {currentOutlook.sources?.length > 0 && (
                <span className="news-meta" style={{ fontSize: 10, padding: '3px 8px', borderRadius: 2, background: '#334155', color: 'white' }}>
                  {currentOutlook.sources.length} Sources
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="news-headline" style={{
              fontSize: 32, color: TEXT, lineHeight: 1.2,
              marginBottom: 16,
            }}>
              {currentOutlook.title}
            </h1>

            {/* Byline */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
              paddingBottom: 16, marginBottom: 24,
              borderBottom: `2px solid ${RED}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: TEXT2, fontFamily: 'Arial, sans-serif' }}>
                <Clock size={12} strokeWidth={1.5} />
                {currentOutlook.date} · {currentOutlook.readTime}
              </div>
              {currentOutlook.regions?.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: TEXT2, fontFamily: 'Arial, sans-serif' }}>
                  <Globe size={12} strokeWidth={1.5} />
                  {currentOutlook.regions.join(', ')}
                </div>
              )}
              {currentOutlook.sources?.length > 0 && (
                <span style={{ fontSize: 12, color: TEXT2, fontFamily: 'Arial, sans-serif' }}>
                  {currentOutlook.sources.length} sources
                </span>
              )}
            </div>

            {/* Executive summary */}
            <div className="news-meta" style={{ fontSize: 10, color: TEXT3, marginBottom: 10 }}>Executive Summary</div>
            <div style={{ borderLeft: `4px solid ${RED}`, paddingLeft: 20, marginBottom: 32 }}>
              <p className="news-body" style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.7 }}>
                {currentOutlook.summary}
              </p>
            </div>

            {/* Body */}
            <div className="news-body" style={{ fontSize: 15.5, color: TEXT, lineHeight: 1.75 }}>
              {currentOutlook.annotations?.length > 0 ? (
                <AnnotatedText
                  text={displayText}
                  annotations={currentOutlook.annotations}
                  sources={currentOutlook.sources}
                />
              ) : (
                displayText.split('\n\n').filter(Boolean).map((p, i) => (
                  <p key={i} style={{ marginBottom: 20 }}>{p}</p>
                ))
              )}
            </div>

            {/* Map */}
            {currentOutlook.mapConfig?.markers?.length > 0 && (
              <div style={{ marginTop: 36, borderRadius: 4, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                <MapViewer config={currentOutlook.mapConfig} />
              </div>
            )}

            {/* Sources */}
            {currentOutlook.sources?.length > 0 && (
              <div style={{ marginTop: 36, paddingTop: 24, borderTop: `2px solid ${RED}` }}>
                <div className="news-meta" style={{ fontSize: 10, color: TEXT3, marginBottom: 12 }}>Sources</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {currentOutlook.sources.map(s => (
                    <div key={s.id} style={{ display: 'flex', gap: 12, fontSize: 13 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: TEXT3, minWidth: '1.5rem' }}>
                        [{s.id}]
                      </span>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          color: '#1d4ed8', fontFamily: 'Georgia, serif',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}
                      >
                        {s.title}
                        <ArrowUpRight size={11} strokeWidth={2} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Calendar */}
      {currentOutlook.topicSlug && (
        <OutlookCalendar
          topicSlug={currentOutlook.topicSlug}
          topicName={currentOutlook.topic}
          currentOutlookSlug={params.id}
          isOpen={calendarOpen}
          onClose={() => setCalendarOpen(false)}
        />
      )}

      {/* AI Chat */}
      <AIOutlookChat
        outlookTitle={currentOutlook.title}
        outlookTopic={currentOutlook.topic}
        outlookId={params.id}
      />
    </>
  );
}

function ToolbarBtn({ icon, label, onClick, active }: {
  icon: React.ReactNode; label: string; onClick: () => void; active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="news-meta"
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 10px', borderRadius: 2,
        fontSize: 10, letterSpacing: '0.05em',
        background: active ? RED : 'rgba(255,255,255,0.08)',
        border: 'none',
        color: active ? 'white' : 'rgba(255,255,255,0.70)',
        cursor: 'pointer', fontFamily: 'Arial, sans-serif',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)'; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
    >
      {icon}{label}
    </button>
  );
}
