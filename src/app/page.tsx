import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import PipelineSection from '@/components/PipelineSection';
import InstallSection from '@/components/InstallSection';
import ParametersSection from '@/components/ParametersSection';
import ExamplesSection from '@/components/ExamplesSection';
import ResultsSection from '@/components/ResultsSection';
import GlossarySection from '@/components/GlossarySection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <PipelineSection />
      <InstallSection />
      <ParametersSection />
      <ExamplesSection />
      <ResultsSection />
      <GlossarySection />
    </>
  );
}
