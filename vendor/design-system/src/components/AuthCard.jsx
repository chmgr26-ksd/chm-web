import React from 'react';
import { cn } from '../lib/cn.js';
import { Logo } from './Logo.jsx';

/**
 * AuthCard — 로그인/회원가입 화면 카드 골격 (기획서: 회원가입·로그인 기능).
 * 폼 필드는 children으로 조합합니다.
 *
 * @param {string} title
 * @param {string} [subtitle]
 * @param {React.ReactNode} [footer]  하단 보조 링크
 */
export function AuthCard({ title, subtitle, footer, className, children, ...props }) {
  return (
    <div className={cn('flex min-h-screen items-center justify-center bg-ink-50 p-4', className)} {...props}>
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo variant="full" size={34} />
        </div>
        <div className="rounded-chm-xl border border-border bg-surface p-7 shadow-chm-md">
          <div className="mb-5 text-center">
            <h1 className="text-h3 font-bold text-ink-800">{title}</h1>
            {subtitle && <p className="mt-1 text-body-sm text-ink-500">{subtitle}</p>}
          </div>
          <div className="flex flex-col gap-4">{children}</div>
        </div>
        {footer && <div className="mt-5 text-center text-body-sm text-ink-500">{footer}</div>}
      </div>
    </div>
  );
}

export default AuthCard;
