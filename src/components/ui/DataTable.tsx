import { cn } from '@/lib/cn';

type Props = {
  headers: string[];
  rows: React.ReactNode[][];
  className?: string;
};

export default function DataTable({ headers, rows, className }: Props) {
  return (
    <div
      className={cn(
        'overflow-x-auto rounded-xl border border-viridis-primary/20 bg-viridis-800/40 backdrop-blur-sm shadow-soft',
        className,
      )}
    >
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-viridis-800/70 border-b border-viridis-primary/20">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 font-mono text-[0.72rem] uppercase tracking-wider text-viridis-lime/80"
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
              className="border-t border-viridis-primary/10 transition hover:bg-viridis-primary/10"
            >
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-cream-200/90">
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
