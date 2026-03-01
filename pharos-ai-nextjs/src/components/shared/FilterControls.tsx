'use client';
import { Switch } from '@/components/ui/switch';

/** Labelled group of filter rows. */
export function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid var(--bd-s)' }}>
      <div className="label" style={{ padding: '0 12px', marginBottom: 4, fontSize: 8 }}>{label}</div>
      {children}
    </div>
  );
}

/** Checkbox-style toggle row used in filter rails. */
export function CheckboxRow({
  label, color, checked, onChange,
}: { label: string; color: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="row-btn"
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px' }}>
      <div style={{
        width: 11, height: 11, flexShrink: 0,
        border: `1px solid ${checked ? color : 'var(--bd)'}`,
        background: checked ? color : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {checked && <div style={{ width: 5, height: 5, background: 'var(--bg-app)' }} />}
      </div>
      <span style={{ fontSize: 10, color: checked ? 'var(--t1)' : 'var(--t2)' }}>{label}</span>
    </button>
  );
}

/** shadcn Switch-based toggle row used in filter rails. */
export function ToggleRow({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={e => e.key === 'Enter' && onChange(!checked)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 12px', cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: 10, color: checked ? 'var(--t1)' : 'var(--t2)' }}>{label}</span>
      <Switch
        size="sm"
        checked={checked}
        onCheckedChange={onChange}
        onClick={e => e.stopPropagation()}
        style={{ '--tw-ring-color': 'var(--blue)' } as React.CSSProperties}
      />
    </div>
  );
}
