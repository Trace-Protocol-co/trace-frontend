import { HeroSection } from "../components/landing/hero-section";
import { HowItWorksSection } from "../components/landing/how-it-works-section";
import { ProvenanceGraphDemo } from "../components/landing/provenance-graph-demo";
import { VerificationTerminal } from "../components/landing/verification-terminal";
import { BrowserExtensionPreview } from "../components/landing/browser-extension-preview";
import { WhySuiWalrus } from "../components/landing/why-sui-walrus";
import { LiveDemoFlow } from "../components/landing/live-demo-flow";
import { Footer } from "../components/landing/footer";

export function LandingPage() {
  return (
    <div className="relative">
      <HeroSection />
      <HowItWorksSection />
      <ProvenanceGraphDemo />
      <VerificationTerminal />
      <BrowserExtensionPreview />
      <WhySuiWalrus />
      <LiveDemoFlow />
      <Footer />
    </div>
  );
}
