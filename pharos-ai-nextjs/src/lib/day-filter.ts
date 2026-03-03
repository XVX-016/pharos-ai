import type { ActorDaySnapshot, ConflictDaySnapshot, IntelEvent, XPost, Actor } from '@/types/domain';

/** Get the day (YYYY-MM-DD) a timestamp falls on (defaults to last day). */
export function getDayFromTimestamp(ts: string, allDays: string[]): string {
  const date = ts.slice(0, 10);
  if (allDays.includes(date)) return date;
  return allDays[allDays.length - 1];
}

/** Filter events to a single conflict day. */
export function getEventsForDay(events: IntelEvent[], allDays: string[], day: string): IntelEvent[] {
  return events.filter(e => getDayFromTimestamp(e.timestamp, allDays) === day);
}

/** Filter X posts to a single conflict day. */
export function getPostsForDay(posts: XPost[], allDays: string[], day: string): XPost[] {
  return posts.filter(p => getDayFromTimestamp(p.timestamp, allDays) === day);
}

/** Get an actor's snapshot for a given day. */
export function getActorForDay(actor: Actor, day: string): ActorDaySnapshot {
  return actor.daySnapshots[day];
}

/** Get the conflict-level snapshot for a given day. */
export function getConflictForDay(snapshots: ConflictDaySnapshot[], day: string): ConflictDaySnapshot {
  return snapshots.find(s => s.day === day) ?? snapshots[snapshots.length - 1];
}

/** Day index (0-based). */
export function dayIndex(day: string, allDays: string[]): number {
  return allDays.indexOf(day);
}

/** Human label: "DAY 1", "DAY 2", etc. */
export function dayLabel(day: string, allDays: string[]): string {
  return `DAY ${dayIndex(day, allDays) + 1}`;
}

/** Short date: "FEB 28", "MAR 1", etc. */
export function dayShort(day: string): string {
  const d = new Date(day + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).toUpperCase();
}

/** Abbreviated day label: "D1", "D2", etc. */
export function dayAbbrev(day: string, allDays: string[]): string {
  return `D${dayIndex(day, allDays) + 1}`;
}
