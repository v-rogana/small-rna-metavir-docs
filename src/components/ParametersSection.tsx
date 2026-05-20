import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import DataTable from './ui/DataTable';
import { HARDCODED_CONSTANTS, OPTIONAL_PARAMS, REQUIRED_PARAMS } from '@/data/parameters';

function flagCell(flag: string) {
  return (
    <code className="font-mono text-[0.82rem] text-viridis-lime">{flag}</code>
  );
}

export default function ParametersSection() {
  return (
    <section id="parameters" className="border-y border-viridis-primary/15 bg-viridis-800/20 py-24 md:py-28">
      <div className="container-doc">
        <SectionHeading
          figureRef="Parameters & defaults"
          eyebrow="Reference"
          title="Every flag in main.pl, in one place"
          description="Required, optional and the hardcoded constants you may need to know about when troubleshooting."
        />

        <h3 className="lab-label">Table 3 · Required parameters</h3>
        <Reveal className="mt-4">
          <DataTable
            headers={['Parameter', 'Type', 'Description', 'Example']}
            rows={REQUIRED_PARAMS.map((p) => [
              flagCell(p.flag),
              <span key="t" className="text-cream-200/60 font-mono text-xs">{p.type}</span>,
              <span key="d" className="text-cream-200/90">{p.description}</span>,
              p.example ? <code key="e" className="font-mono text-[0.82rem] text-cream-200/85">{p.example}</code> : '',
            ])}
          />
        </Reveal>

        <h3 className="lab-label mt-12">Table 4 · Optional parameters</h3>
        <Reveal className="mt-4">
          <DataTable
            headers={['Parameter', 'Default', 'Description']}
            rows={OPTIONAL_PARAMS.map((p) => [
              flagCell(p.flag),
              <span key="t" className="data-mono text-xs">{p.type}</span>,
              <span key="d" className="text-cream-200/90">{p.description}</span>,
            ])}
          />
        </Reveal>

        <h3 className="lab-label mt-12">Table 5 · Key internal constants</h3>
        <Reveal className="mt-4">
          <DataTable
            headers={['Tool', 'Parameter', 'Value']}
            rows={HARDCODED_CONSTANTS.map((c) => [
              <span key="t" className="text-cream-50 font-medium">{c.tool}</span>,
              <code key="p" className="font-mono text-[0.82rem] text-viridis-lime">{c.param}</code>,
              <span key="v" className="data-mono text-cream-200/90">{c.value}</span>,
            ])}
          />
        </Reveal>
      </div>
    </section>
  );
}
