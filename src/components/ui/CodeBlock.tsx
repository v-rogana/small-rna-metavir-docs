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
    <div
      className={cn(
        'group relative my-4 rounded-xl border border-viridis-primary/25 bg-viridis-900/80 shadow-[0_0_0_1px_rgba(33,145,140,0.15),0_18px_40px_-20px_rgba(0,0,0,0.7)]',
        className,
      )}
    >
      {language && (
        <div className="flex items-center justify-between px-4 pt-3 border-b border-viridis-primary/15 pb-2">
          <span className="font-mono text-[0.72rem] uppercase tracking-wider text-viridis-lime/70">
            {language}
          </span>
          {copy && (
            <CopyButton
              value={code}
              className="!bg-viridis-800/60 !border-viridis-primary/30 !text-cream-100 hover:!text-viridis-lime"
            />
          )}
        </div>
      )}
      {!language && copy && (
        <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
          <CopyButton
            value={code}
            className="!bg-viridis-800/60 !border-viridis-primary/30 !text-cream-100 hover:!text-viridis-lime"
          />
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-4 text-[0.82rem] leading-relaxed">
        <code className="font-mono text-cream-100">{code}</code>
      </pre>
    </div>
  );
}
