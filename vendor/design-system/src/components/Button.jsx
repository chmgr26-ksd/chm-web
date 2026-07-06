import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Button — CHM Group 기본 액션 버튼.
 *
 * @param {'solid'|'soft'|'outline'|'ghost'|'link'} [variant='solid']
 * @param {'primary'|'cta'|'success'|'warning'|'caution'|'danger'|'ink'} [tone='primary']
 * @param {'sm'|'md'|'lg'} [size='md']
 * @param {boolean} [block]  전체 너비
 * @param {boolean} [loading]
 * @param {React.ReactNode} [leftIcon] [rightIcon]
 * @param {React.ElementType} [as='button']  렌더할 엘리먼트/컴포넌트.
 *   링크로 쓰려면 `as={Link}`(next/link) 또는 `as="a"`를 지정 — <a> 안에 <button>을
 *   중첩(잘못된 HTML)하지 말고 버튼 자체를 링크로 렌더할 것.
 */
const TONE = {
  primary: {
    solid: 'bg-trust-500 text-white hover:bg-trust-600 active:bg-trust-700',
    soft: 'bg-trust-50 text-trust-700 hover:bg-trust-100',
    outline: 'border border-trust-500 text-trust-600 hover:bg-trust-50',
    ghost: 'text-trust-600 hover:bg-trust-50',
    link: 'text-trust-600 underline-offset-4 hover:underline',
  },
  cta: {
    solid: 'bg-cta text-white hover:bg-cta-hover active:bg-cta-active',
    soft: 'bg-cta-soft text-selfreliance-700 hover:bg-selfreliance-100',
    outline: 'border border-cta text-selfreliance-700 hover:bg-cta-soft',
    ghost: 'text-selfreliance-700 hover:bg-cta-soft',
    link: 'text-selfreliance-700 underline-offset-4 hover:underline',
  },
  success: {
    solid: 'bg-cooperation-500 text-white hover:bg-cooperation-600 active:bg-cooperation-700',
    soft: 'bg-cooperation-50 text-cooperation-700 hover:bg-cooperation-100',
    outline: 'border border-cooperation-500 text-cooperation-700 hover:bg-cooperation-50',
    ghost: 'text-cooperation-700 hover:bg-cooperation-50',
    link: 'text-cooperation-700 underline-offset-4 hover:underline',
  },
  warning: {
    solid: 'bg-selfreliance-500 text-white hover:bg-selfreliance-600 active:bg-selfreliance-700',
    soft: 'bg-selfreliance-50 text-selfreliance-700 hover:bg-selfreliance-100',
    outline: 'border border-selfreliance-500 text-selfreliance-700 hover:bg-selfreliance-50',
    ghost: 'text-selfreliance-700 hover:bg-selfreliance-50',
    link: 'text-selfreliance-700 underline-offset-4 hover:underline',
  },
  caution: {
    solid: 'bg-community-500 text-ink-900 hover:bg-community-600 active:bg-community-700',
    soft: 'bg-community-50 text-community-700 hover:bg-community-100',
    outline: 'border border-community-500 text-community-700 hover:bg-community-50',
    ghost: 'text-community-700 hover:bg-community-50',
    link: 'text-community-700 underline-offset-4 hover:underline',
  },
  danger: {
    solid: 'bg-danger text-white hover:bg-danger-hover',
    soft: 'bg-danger-soft text-danger hover:brightness-95',
    outline: 'border border-danger text-danger hover:bg-danger-soft',
    ghost: 'text-danger hover:bg-danger-soft',
    link: 'text-danger underline-offset-4 hover:underline',
  },
  ink: {
    solid: 'bg-ink-800 text-white hover:bg-ink-900',
    soft: 'bg-ink-100 text-ink-800 hover:bg-ink-200',
    outline: 'border border-ink-300 text-ink-800 hover:bg-ink-50',
    ghost: 'text-ink-700 hover:bg-ink-100',
    link: 'text-ink-800 underline-offset-4 hover:underline',
  },
};

const SIZE = {
  sm: 'h-8 px-3 text-body-sm gap-1.5 rounded-chm-sm',
  md: 'h-10 px-4 text-body gap-2 rounded-chm-md',
  lg: 'h-12 px-6 text-body-lg gap-2 rounded-chm-lg',
};

export const Button = React.forwardRef(function Button(
  {
    as: Comp = 'button',
    variant = 'solid',
    tone = 'primary',
    size = 'md',
    block = false,
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    className,
    children,
    ...props
  },
  ref
) {
  const isNative = Comp === 'button';
  const isBlocked = disabled || loading;
  // <button>이 아닐 때(<a>/Link 등)는 disabled 대신 aria/스타일로 비활성 표현.
  const stateProps = isNative
    ? { disabled: isBlocked }
    : { 'aria-disabled': isBlocked || undefined };

  return (
    <Comp
      ref={ref}
      {...stateProps}
      className={cn(
        'inline-flex items-center justify-center font-semibold whitespace-nowrap select-none',
        'transition-colors duration-chm ease-chm focus:outline-none focus-visible:ring-2 focus-visible:ring-trust-300 focus-visible:ring-offset-1',
        isNative ? 'disabled:opacity-50 disabled:pointer-events-none' : isBlocked && 'opacity-50 pointer-events-none',
        SIZE[size],
        TONE[tone][variant],
        block && 'w-full',
        className
      )}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </Comp>
  );
});

export default Button;
