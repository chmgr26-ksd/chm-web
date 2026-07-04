import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Table — 데이터 테이블 (선택적 데이터 주도 렌더링).
 *
 * 방식 A) 선언형 children:
 *   <Table><THead>…</THead><TBody>…</TBody></Table>
 *
 * 방식 B) 데이터 주도:
 *   <Table columns={[{key,header,align,render}]} data={rows} rowKey="id" />
 */
export function Table({ columns, data, rowKey = 'id', dense = false, className, children, ...props }) {
  const pad = dense ? 'px-3 py-2' : 'px-4 py-3';
  return (
    <div className={cn('overflow-x-auto rounded-chm-lg border border-border', className)}>
      <table className="w-full border-collapse text-body-sm" {...props}>
        {columns && data ? (
          <>
            <thead>
              <tr className="border-b border-border bg-ink-50 text-left">
                {columns.map((c) => (
                  <th key={c.key} className={cn(pad, 'font-semibold text-ink-600 whitespace-nowrap', c.align === 'right' && 'text-right', c.align === 'center' && 'text-center')}>
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row[rowKey] ?? i} className="border-b border-border last:border-0 transition-colors hover:bg-ink-50">
                  {columns.map((c) => (
                    <td key={c.key} className={cn(pad, 'text-ink-700', c.align === 'right' && 'text-right', c.align === 'center' && 'text-center')}>
                      {c.render ? c.render(row[c.key], row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          children
        )}
      </table>
    </div>
  );
}

export function THead({ className, children, ...props }) {
  return <thead className={cn('border-b border-border bg-ink-50', className)} {...props}>{children}</thead>;
}
export function TBody({ className, children, ...props }) {
  return <tbody className={className} {...props}>{children}</tbody>;
}
export function TR({ className, children, ...props }) {
  return <tr className={cn('border-b border-border last:border-0 transition-colors hover:bg-ink-50', className)} {...props}>{children}</tr>;
}
export function TH({ align, className, children, ...props }) {
  return <th className={cn('px-4 py-3 text-left font-semibold text-ink-600', align === 'right' && 'text-right', className)} {...props}>{children}</th>;
}
export function TD({ align, className, children, ...props }) {
  return <td className={cn('px-4 py-3 text-ink-700', align === 'right' && 'text-right', className)} {...props}>{children}</td>;
}

export default Table;
