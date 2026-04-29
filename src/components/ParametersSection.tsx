import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import DataTable from './ui/DataTable';
import { HARDCODED_CONSTANTS, OPTIONAL_PARAMS, REQUIRED_PARAMS } from '@/data/parameters';

function flagCell(flag: string) {
  return (
    <code className="font-mono text-[0.82rem] text-accent">{flag}</code>
  );
}

export default function ParametersSection() {
  return (
    <section id="parameters" className="bg-cream-100/40 py-24 md:py-28">
      <div className="container-doc">
        <SectionHeading
          eyebrow="Parameters"
          title="Reference for every flag in main.pl"
          description="Required, optional and the hardcoded constants you may need to know about when troubleshooting."
        />

        <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-500">
          Required
        </h3>
        <Reveal className="mt-4">
          <DataTable
            headers={['Parameter', 'Type', 'Description', 'Example']}
            rows={REQUIRED_PARAMS.map((p) => [
              flagCell(p.flag),
              <span key="t" className="text-ink-500">{p.type}</span>,
              <span key="d">{p.description}</span>,
              p.example ? <code key="e" className="font-mono text-[0.82rem]">{p.example}</code> : '',
            ])}
          />
        </Reveal>

        <h3 className="mt-12 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-500">
          Optional
        </h3>
        <Reveal className="mt-4">
          <DataTable
            headers={['Parameter', 'Default', 'Description']}
            rows={OPTIONAL_PARAMS.map((p) => [
              flagCell(p.flag),
              <span key="t" className="text-ink-500">{p.type}</span>,
              <span key="d">{p.description}</span>,
            ])}
          />
        </Reveal>

        <h3 className="mt-12 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-500">
          Key internal constants
        </h3>
        <Reveal className="mt-4">
          <DataTable
            headers={['Tool', 'Parameter', 'Value']}
            rows={HARDCODED_CONSTANTS.map((c) => [
              <span key="t" className="text-ink-900 font-medium">{c.tool}</span>,
              <code key="p" className="font-mono text-[0.82rem] text-accent">{c.param}</code>,
              <span key="v" className="text-ink-700">{c.value}</span>,
            ])}
          />
        </Reveal>
      </div>
    </section>
  );
}
