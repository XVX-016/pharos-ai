'use client';
/**
 * Pharos tab bar — uses shadcn Tabs (Radix UI) under the hood but
 * styled with the Blueprint dark-theme design system vars.
 */
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export interface TabItem<T extends string> {
  value: T;
  label: string;
}

interface IntelTabsProps<T extends string> {
  value: T;
  onValueChange: (v: T) => void;
  tabs: TabItem<T>[];
  children: React.ReactNode;
}

export function IntelTabBar<T extends string>({
  value, onValueChange, tabs, children,
}: IntelTabsProps<T>) {
  return (
    <Tabs
      value={value}
      onValueChange={v => onValueChange(v as T)}
      style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}
    >
      <TabsList
        variant="line"
        style={{
          height: 38, width: '100%', borderRadius: 0,
          borderBottom: '1px solid var(--bd)', background: 'var(--bg-2)',
          display: 'flex', gap: 0, padding: 0, justifyContent: 'flex-start',
        }}
      >
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            style={{
              borderRadius: 0, height: '100%', padding: '0 18px',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', flex: 'none',
              color: value === tab.value ? 'var(--t1)' : 'var(--t2)',
              borderBottom: value === tab.value ? '2px solid var(--blue)' : '2px solid transparent',
              background: value === tab.value ? 'var(--bg-1)' : 'transparent',
              transition: 'color .1s, border-color .1s, background .1s',
            }}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}

export { TabsContent };
