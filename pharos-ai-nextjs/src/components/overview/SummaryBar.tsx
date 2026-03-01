const CHIPS = [
  { label: 'KHAMENEI KILLED', danger: true  },
  { label: 'HORMUZ CLOSED',   danger: true  },
  { label: '3 US KIA',        danger: true  },
  { label: 'OIL +35%',        danger: true  },
  { label: '201 IR DEAD',     danger: true  },
  { label: 'DAY 2',           danger: false },
] as const;

export function SummaryBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '0 16px', height: 36, flexShrink: 0,
      background: 'var(--bg-app)', borderBottom: '1px solid var(--bd)',
      overflowX: 'auto',
    }}>
      <span className="label" style={{ fontSize: 8, color: 'var(--t4)', flexShrink: 0 }}>KEY FACTS</span>
      <div style={{ width: 1, height: 14, background: 'var(--bd)', flexShrink: 0 }} />
      {CHIPS.map(chip => (
        <div key={chip.label} style={{
          display: 'flex', alignItems: 'center',
          padding: '2px 8px', flexShrink: 0,
          background: chip.danger ? 'var(--danger-dim)' : 'var(--bg-2)',
          border: `1px solid ${chip.danger ? 'rgba(231,106,110,.3)' : 'var(--bd)'}`,
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
            color: chip.danger ? 'var(--danger)' : 'var(--t2)',
            fontFamily: 'SFMono-Regular, monospace',
          }}>
            {chip.label}
          </span>
        </div>
      ))}
      <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
        <span className="mono" style={{ fontSize: 9, color: 'var(--t4)' }}>
          Feb 28 – Mar 1, 2026 · OPERATIONS ONGOING
        </span>
      </div>
    </div>
  );
}
