'use client';

import StoryIcon from './StoryIcon';

import type { MapStory } from '@/data/mapStories';

// ─── Types ──────────────────────────────────────────────────────────────────────

type Props = {
  stories:    MapStory[];
  activeId:   string | null;
  onActivate: (story: MapStory) => void;
};

type DayGroup = {
  label: string;
  date:  string;
  stories: MapStory[];
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

function groupByDay(stories: MapStory[]): DayGroup[] {
  const sorted = [...stories].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const groups = new Map<string, MapStory[]>();
  for (const s of sorted) {
    const d = new Date(s.timestamp);
    const key = d.toISOString().slice(0, 10);
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }

  return [...groups.entries()].map(([date, stories]) => {
    const d = new Date(date + 'T00:00:00Z');
    const mon = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
    const day = d.getUTCDate().toString().padStart(2, '0');
    return { label: `${mon} ${day}`, date, stories };
  });
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function StoryTimeline({ stories, activeId, onActivate }: Props) {
  const days = groupByDay(stories);

  return (
    <div
      className="flex-shrink-0"
      style={{
        background: 'var(--bg-app)',
        borderBottom: '1px solid var(--bd-s)',
        padding: '8px 12px 10px',
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="label" style={{ color: 'var(--t4)' }}>TIMELINE</span>
        <span className="mono text-[8px] text-[var(--t4)]">
          {days[0]?.label} – {days[days.length - 1]?.label}
        </span>
      </div>

      {/* Day columns */}
      <div className="flex gap-0">
        {days.map((day, di) => (
          <div
            key={day.date}
            className="flex-1 min-w-0"
            style={{
              borderLeft: di > 0 ? '1px solid var(--bd-s)' : undefined,
              paddingLeft: di > 0 ? 8 : 0,
            }}
          >
            {/* Day label */}
            <div className="mono text-[8px] font-bold text-[var(--t4)] mb-1.5 tracking-wider">
              {day.label}
            </div>

            {/* Story icons — wrap if many */}
            <div className="flex flex-wrap gap-1">
              {day.stories.map(story => {
                const isActive = story.id === activeId;
                return (
                  <div
                    key={story.id}
                    onClick={() => onActivate(story)}
                    title={story.title}
                    className="cursor-pointer"
                    style={{
                      borderRadius: 2,
                      outline: isActive ? '2px solid var(--blue)' : '2px solid transparent',
                      outlineOffset: 1,
                      boxShadow: isActive ? '0 0 8px rgba(45,114,210,0.4)' : 'none',
                      transition: 'outline 0.15s, box-shadow 0.15s',
                    }}
                  >
                    <StoryIcon
                      iconName={story.iconName}
                      category={story.category}
                      size={11}
                      boxSize={20}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
