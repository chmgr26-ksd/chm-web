import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Tabs — 탭 네비게이션 (controlled/uncontrolled).
 *
 *   <Tabs defaultValue="a">
 *     <TabList>
 *       <Tab value="a">주거관리</Tab>
 *       <Tab value="b">점포관리</Tab>
 *     </TabList>
 *     <TabPanel value="a">...</TabPanel>
 *     <TabPanel value="b">...</TabPanel>
 *   </Tabs>
 */
const TabsCtx = React.createContext(null);

export function Tabs({ value, defaultValue, onValueChange, className, children, ...props }) {
  const [internal, setInternal] = React.useState(defaultValue);
  const active = value !== undefined ? value : internal;
  const setActive = (v) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <TabsCtx.Provider value={{ active, setActive }}>
      <div className={className} {...props}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabList({ className, children, ...props }) {
  return (
    <div role="tablist" className={cn('flex items-center gap-1 border-b border-border', className)} {...props}>
      {children}
    </div>
  );
}

export function Tab({ value, className, children, ...props }) {
  const ctx = React.useContext(TabsCtx);
  const selected = ctx.active === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={() => ctx.setActive(value)}
      className={cn(
        'relative -mb-px px-4 py-2.5 text-body-sm font-semibold transition-colors duration-chm',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-trust-300 rounded-t-chm-sm',
        selected ? 'text-trust-700' : 'text-ink-500 hover:text-ink-800',
        className
      )}
      {...props}
    >
      {children}
      {selected && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-trust-500" />}
    </button>
  );
}

export function TabPanel({ value, className, children, ...props }) {
  const ctx = React.useContext(TabsCtx);
  if (ctx.active !== value) return null;
  return <div role="tabpanel" className={cn('pt-4', className)} {...props}>{children}</div>;
}

export default Tabs;
