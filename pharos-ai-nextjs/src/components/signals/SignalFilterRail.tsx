'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FilterBlock, CheckboxRow, ToggleRow } from '@/components/shared/FilterControls';

export type Significance = 'BREAKING' | 'HIGH' | 'STANDARD';
export type AccountType  = 'military' | 'government' | 'journalist' | 'analyst' | 'official';

const SIG_LABELS: Significance[] = ['BREAKING', 'HIGH', 'STANDARD'];
const ACCT_LABELS: AccountType[] = ['military', 'government', 'journalist', 'analyst'];
const SIG_C: Record<Significance, string> = {
  BREAKING: 'var(--danger)', HIGH: 'var(--warning)', STANDARD: 'var(--info)',
};

interface Props {
  sigFilter:    Record<Significance, boolean>;
  acctFilter:   Record<AccountType, boolean>;
  pharosOnly:   boolean;
  totalShown:   number;
  totalAll:     number;
  onSigChange:  (s: Significance, v: boolean) => void;
  onAcctChange: (a: AccountType, v: boolean) => void;
  onPharosOnly: (v: boolean) => void;
}

export function SignalFilterRail({
  sigFilter, acctFilter, pharosOnly, totalShown, totalAll,
  onSigChange, onAcctChange, onPharosOnly,
}: Props) {
  return (
    <div style={{
      width: 240, minWidth: 240, flexShrink: 0,
      borderRight: '1px solid var(--bd)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div className="panel-header">
        <span style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1 }}>𝕏</span>
        <span className="section-title">Signal Filters</span>
      </div>
      <ScrollArea style={{ flex: 1 }}>
        <FilterBlock label="SIGNIFICANCE">
          {SIG_LABELS.map(s => (
            <CheckboxRow key={s} label={s} color={SIG_C[s]}
              checked={sigFilter[s]} onChange={v => onSigChange(s, v)} />
          ))}
        </FilterBlock>
        <FilterBlock label="ACCOUNT TYPE">
          {ACCT_LABELS.map(a => (
            <CheckboxRow key={a} label={a.toUpperCase()} color="var(--info)"
              checked={acctFilter[a]} onChange={v => onAcctChange(a, v)} />
          ))}
        </FilterBlock>
        <FilterBlock label="ANALYST NOTES">
          <ToggleRow label="Pharos notes only" checked={pharosOnly} onChange={onPharosOnly} />
        </FilterBlock>
      </ScrollArea>
      <div style={{ padding: '8px 12px', borderTop: '1px solid var(--bd)', flexShrink: 0 }}>
        <span className="mono" style={{ fontSize: 9, color: 'var(--t3)' }}>
          {totalShown} / {totalAll} SIGNALS
        </span>
      </div>
    </div>
  );
}
