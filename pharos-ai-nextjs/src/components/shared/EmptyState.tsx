import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  message: string;
}

/** Centered empty state with optional icon or emoji. */
export function EmptyState({ icon: Icon, emoji, message }: EmptyStateProps) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      {Icon && <Icon size={32} style={{ color: 'var(--t3)' }} strokeWidth={1} />}
      {emoji && <span style={{ fontSize: 24, color: 'var(--t3)' }}>{emoji}</span>}
      <span className="label" style={{ color: 'var(--t3)' }}>{message}</span>
    </div>
  );
}
