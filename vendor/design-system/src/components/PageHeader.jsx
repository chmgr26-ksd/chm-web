import React from 'react';
import { cn } from '../lib/cn.js';
import { Breadcrumb } from './Breadcrumb.jsx';

/**
 * PageHeader — 페이지 제목 영역 (브레드크럼 + 제목 + 설명 + 액션).
 * @param {string} title
 * @param {string} [description]
 * @param {{label,href}[]} [breadcrumb]
 * @param {React.ReactNode} [actions]
 */
export function PageHeader({ title, description, breadcrumb, actions, className, children, ...props }) {
  return (
    <div className={cn('mb-6 flex flex-col gap-3', className)} {...props}>
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-h2 font-bold text-ink-800">{title}</h1>
          {description && <p className="mt-1.5 text-body text-ink-600">{description}</p>}
        </div>
        {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export default PageHeader;
