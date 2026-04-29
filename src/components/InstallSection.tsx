import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import CodeBlock from './ui/CodeBlock';
import Tabs from './ui/Tabs';
import DataTable from './ui/DataTable';

const DOCKER_CMDS = `# 1. Clone the repository
git clone https://github.com/v-rogana/small-rna-metavir.git
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
        eyebrow="Installation"
        title="Run the pipeline in a container"
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

      <h3 className="mt-14 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-500">
        Required databases
      </h3>
      <Reveal className="mt-4">
        <DataTable
          headers={['Database', 'Container path', 'Size', 'Setup command']}
          rows={[
            [
              'Host genome',
              <code key="hp" className="font-mono text-[0.82rem]">-hostgenome param</code>,
              '1-3 GB',
              <code key="hc" className="font-mono text-[0.82rem]">bowtie-build --threads 20 host.fa host.fa</code>,
            ],
            [
              'Bacterial genomes',
              <code key="bp" className="font-mono text-[0.82rem]">/asset/refs/bacterial_genomes/</code>,
              '~5 GB',
              <code key="bc" className="font-mono text-[0.82rem]">bowtie-build --large-index --threads 20 all_bacters.fa all_bacters.fa</code>,
            ],
            [
              'NCBI nt (core_nt)',
              <code key="np" className="font-mono text-[0.82rem]">/asset/blastdb/nt/</code>,
              '~150 GB',
              <code key="nc" className="font-mono text-[0.82rem]">update_blastdb.pl --decompress nt</code>,
            ],
            [
              'NCBI nr (Diamond)',
              <code key="dp" className="font-mono text-[0.82rem]">/asset/diamond/</code>,
              '~60-100 GB',
              <code key="dc" className="font-mono text-[0.82rem]">diamond makedb --in nr.gz --db nrcluster_tax --taxonmap …</code>,
            ],
            [
              'RF Classifier',
              <code key="rp" className="font-mono text-[0.82rem]">/asset/classifier/</code>,
              '<1 MB',
              <span key="rc" className="text-ink-500">Included in the repository (asset/)</span>,
            ],
          ]}
        />
      </Reveal>
    </section>
  );
}
