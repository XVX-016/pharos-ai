import { ActorResponseList } from '@/features/browse/components/ActorResponseList';
import { BrowsePageHeader } from '@/features/browse/components/BrowsePageHeader';
import { SeverityBadge } from '@/features/browse/components/SeverityBadge';
import { SignalCard } from '@/features/browse/components/SignalCard';
import { SourceList } from '@/features/browse/components/SourceList';

import { fmtDate, fmtTimeZ } from '@/shared/lib/format';

type Source = {
  name: string;
  tier: number;
  reliability: number;
  url?: string | null;
};

type ActorResponse = {
  actorId: string;
  actorName: string;
  stance: string;
  type: string;
  statement: string;
};

type Signal = {
  handle: string;
  displayName: string;
  significance: string;
  timestamp: string;
  content: string;
  likes: number;
  retweets: number;
  views: number;
  pharosNote?: string | null;
};

type Props = {
  event: {
    severity: string;
    type: string;
    title: string;
    timestamp: string;
    location: string;
    verified: boolean;
    summary: string;
    fullContent: string | null;
    tags: string[];
    sources: Source[];
    actorResponses: ActorResponse[];
  };
  signals: Signal[];
};

export function EventArticle({ event, signals }: Props) {
  return (
    <article className="max-w-2xl mx-auto px-6 py-10">
      <BrowsePageHeader
        crumbs={[
          { label: 'Events', href: '/browse/events' },
          { label: event.title },
        ]}
      />

      {/* Headline */}
      <header className="mt-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <SeverityBadge severity={event.severity} />
          <span className="mono text-[10px] text-[var(--t4)]">{event.type}</span>
          {event.verified && (
            <span className="mono text-[9px] font-bold text-[var(--success)]">VERIFIED</span>
          )}
        </div>

        <h1 className="text-[28px] sm:text-[36px] font-bold text-[var(--t1)] leading-[1.15] mb-4">
          {event.title}
        </h1>

        <div className="flex items-center gap-2 text-[var(--t4)]">
          <time className="mono text-xs">
            {fmtDate(event.timestamp)} · {fmtTimeZ(event.timestamp)}
          </time>
          <span className="text-xs">·</span>
          <span className="text-xs">{event.location}</span>
        </div>
      </header>

      <div className="h-px bg-[var(--bd)] mb-8" />

      {/* Lead / summary */}
      <p className="text-[18px] text-[var(--t1)] leading-[1.6] font-medium mb-8">
        {event.summary}
      </p>

      {/* Full report */}
      {event.fullContent && (
        <div className="text-[15px] text-[var(--t2)] leading-[1.8] whitespace-pre-line mb-10">
          {event.fullContent}
        </div>
      )}

      {/* Tags */}
      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-10">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="mono text-[10px] px-2 py-0.5 border border-[var(--bd)] text-[var(--t3)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actor responses */}
      {event.actorResponses.length > 0 && (
        <section className="mb-10">
          <div className="h-px bg-[var(--bd)] mb-8" />
          <ActorResponseList responses={event.actorResponses} />
        </section>
      )}

      {/* Sources */}
      {event.sources.length > 0 && (
        <section className="mb-10">
          <div className="h-px bg-[var(--bd)] mb-8" />
          <SourceList sources={event.sources} />
        </section>
      )}

      {/* Related signals */}
      {signals.length > 0 && (
        <section className="mb-10">
          <div className="h-px bg-[var(--bd)] mb-8" />
          <p className="label mb-4">Related signals ({signals.length})</p>
          <div className="flex flex-col gap-3">
            {signals.map((s, i) => (
              <SignalCard key={i} {...s} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
