export function BriefSection({ number, title, children }: {
  number: string; title: string; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue)', fontFamily: 'monospace' }}>
          {number}.
        </span>
        <h2 style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: 1, background: 'var(--bd)' }} />
      </div>
      {children}
    </div>
  );
}

export function EconChip({ label, val, sub, color }: {
  label: string; val: string; sub: string; color: string;
}) {
  return (
    <div style={{ padding: '10px 14px', background: color + '12', border: `1px solid ${color}40`, minWidth: 110 }}>
      <div className="label" style={{ fontSize: 8, color: 'var(--t4)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'SFMono-Regular, monospace', lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: 9, color, marginTop: 3, fontFamily: 'monospace' }}>{sub}</div>
    </div>
  );
}

export function ScenarioCard({ label, subtitle, color, prob, body }: {
  label: string; subtitle: string; color: string; prob: string; body: string;
}) {
  return (
    <div style={{
      padding: '14px 16px', background: color + '08',
      border: `1px solid ${color}35`, borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--t2)', fontStyle: 'italic' }}>{subtitle}</span>
        <div style={{ marginLeft: 'auto', padding: '2px 8px', background: color + '20', border: `1px solid ${color}50` }}>
          <span style={{ fontSize: 9, fontWeight: 700, color, fontFamily: 'monospace' }}>P={prob}</span>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.7 }}>{body}</p>
    </div>
  );
}
