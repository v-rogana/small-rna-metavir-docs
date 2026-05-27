import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import CodeBlock from './ui/CodeBlock';
import Tabs from './ui/Tabs';
import DataTable from './ui/DataTable';

const DOCKER_CMDS = `# 1. Clone the repository
git clone https://github.com/rnai-bioinfo/small-rna-metavir.git
cd small-rna-metavir/docker

# 2. Build the Docker image (30-60 min first time)
docker build --target small_rna_metavir -t small_rna_metavir:latest .

# 3. Start the container with data volumes
docker run -it --rm \\
    -v /path/to/databases:/small-rna-metavir/asset \\
    -v /path/to/your/reads:/data \\
    -v /path/to/output:/small-rna-metavir/src/pipeline/runs \\
    small_rna_metavir:latest bash

# 4. Inside the container
cd /small-rna-metavir/src/pipeline
perl main.pl -h   # verify installation`;

const PODMAN_CMDS = `# Build with caching for faster rebuilds
podman build . --target=stage_perl         -t srna/perl:v01
podman build . --target=stage_python       -t srna/python:v01  --cache-from=localhost/srna/perl:v01
podman build . --target=stage_r            -t srna/r:v01       --cache-from=localhost/srna/python:v01
podman build . --target=stage_dependencies -t srna/deps:v01    --cache-from=localhost/srna/r:v01
podman build . --target=small_rna_metavir  -t srna/metavir:v01 --cache-from=localhost/srna/deps:v01

# Run with SELinux-compatible mount
podman run -it --rm -v /data:/small-rna-metavir/asset:Z srna/metavir:v01 bash`;

export default function InstallSection() {
  return (
    <section id="installation" className="container-doc py-24 md:py-28">
      <SectionHeading
        figureRef="Installation"
        eyebrow="Run in a container"
        title="Reproducible deployment via Docker or Podman"
        description="The recommended path is Docker. Podman is fully supported with staged build caching for faster rebuilds."
      />

      <Reveal>
        <Tabs
          tabs={[
            {
              id: 'docker',
              label: 'Docker (Recommended)',
              content: <CodeBlock code={DOCKER_CMDS} language="bash" />,
            },
            {
              id: 'podman',
              label: 'Podman',
              content: <CodeBlock code={PODMAN_CMDS} language="bash" />,
            },
          ]}
        />
      </Reveal>

      <h3 className="lab-label mt-14">Table 2 · Required databases</h3>
      <Reveal className="mt-4">
        <DataTable
          headers={['Database', 'Container path', 'Size', 'Setup command']}
          rows={[
            [
              <span key="hn" className="text-cream-50 font-medium">Host genome</span>,
              <code key="hp" className="font-mono text-[0.82rem] text-viridis-lime">-hostgenome param</code>,
              <span key="hs" className="data-mono">1–3 GB</span>,
              <code key="hc" className="font-mono text-[0.82rem] text-cream-200/85">bowtie-build --threads 20 host.fa host.fa</code>,
            ],
            [
              <span key="bn" className="text-cream-50 font-medium">Bacterial genomes</span>,
              <code key="bp" className="font-mono text-[0.82rem] text-viridis-lime">/asset/refs/bacterial_genomes/</code>,
              <span key="bs" className="data-mono">~5 GB</span>,
              <code key="bc" className="font-mono text-[0.82rem] text-cream-200/85">bowtie-build --large-index --threads 20 all_bacters.fa all_bacters.fa</code>,
            ],
            [
              <span key="nn" className="text-cream-50 font-medium">NCBI nt (core_nt)</span>,
              <code key="np" className="font-mono text-[0.82rem] text-viridis-lime">/asset/blastdb/nt/</code>,
              <span key="ns" className="data-mono">~150 GB</span>,
              <code key="nc" className="font-mono text-[0.82rem] text-cream-200/85">update_blastdb.pl --decompress nt</code>,
            ],
            [
              <span key="dn" className="text-cream-50 font-medium">NCBI nr (Diamond)</span>,
              <code key="dp" className="font-mono text-[0.82rem] text-viridis-lime">/asset/diamond/</code>,
              <span key="ds" className="data-mono">~60–100 GB</span>,
              <code key="dc" className="font-mono text-[0.82rem] text-cream-200/85">diamond makedb --in nr.gz --db nrcluster_tax --taxonmap …</code>,
            ],
            [
              <span key="rn" className="text-cream-50 font-medium">RF Classifier</span>,
              <code key="rp" className="font-mono text-[0.82rem] text-viridis-lime">/asset/classifier/</code>,
              <span key="rs" className="data-mono">&lt;1 MB</span>,
              <span key="rc" className="text-cream-200/60 text-xs">Included in the repository (asset/)</span>,
            ],
          ]}
        />
      </Reveal>
    </section>
  );
}
