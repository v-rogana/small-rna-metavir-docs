import CopyButton from './CopyButton';
import { cn } from '@/lib/cn';

type Props = {
  code: string;
  language?: string;
  className?: string;
  copy?: boolean;
};

export default function CodeBlock({ code, language, className, copy = true }: Props) {
  return (
    <div className={cn('group relative my-4 rounded-xl border border-cream-200 bg-ink-900 shadow-soft', className)}>
      {language && (
        <div className="flex items-center justify-between px-4 pt-3">
          <span className="font-mono text-[0.72rem] uppercase tracking-wider text-cream-200/60">
            {language}
          </span>
          {copy && <CopyButton value={code} className="!bg-ink-700/40 !border-ink-700 !text-cream-100 hover:!text-accent-bright" />}
        </div>
      )}
      {!language && copy && (
        <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
          <CopyButton value={code} className="!bg-ink-700/40 !border-ink-700 !text-cream-100 hover:!text-accent-bright" />
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-4 text-[0.82rem] leading-relaxed">
        <code className="font-mono text-cream-100">{code}</code>
      </pre>
    </div>
  );
}
