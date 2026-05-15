'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  value: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
};

export default function CopyButton({ value, label = 'Copy', disabled, className, size = 'sm' }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (disabled) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  const Icon = copied ? Check : Copy;
  return (
    <button
      type="button"
      onClick={copy}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-viridis-primary/30 bg-viridis-800/60 backdrop-blur',
        'text-cream-100 hover:text-viridis-lime hover:border-viridis-lime transition disabled:opacity-40 disabled:cursor-not-allowed',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        className,
      )}
      aria-live="polite"
      aria-label={copied ? 'Copied' : label}
    >
      <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
      <span className="font-medium">{copied ? 'Copied' : label}</span>
    </button>
  );
}
