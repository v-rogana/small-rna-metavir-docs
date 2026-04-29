import { cn } from '@/lib/cn';

type Props = {
  headers: string[];
  rows: React.ReactNode[][];
  className?: string;
};

export default function DataTable({ headers, rows, className }: Props) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-cream-200 bg-cream-50 shadow-soft', className)}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-cream-100/80">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 font-mono text-[0.72rem] uppercase tracking-wider text-ink-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-t border-cream-200 transition hover:bg-cream-100/50"
            >
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-ink-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
