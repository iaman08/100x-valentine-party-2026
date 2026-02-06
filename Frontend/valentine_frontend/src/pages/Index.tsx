import FloatingEmojis from "@/components/FloatingEmojis";
import HeroSection from "@/components/HeroSection";
import DetailsSection from "@/components/DetailsSection";
import RSVPSection from "@/components/RSVPSection";
import Footer from "@/components/Footer";
import SparkleTrail from "@/components/SparkleTrail";

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      <SparkleTrail />
      <FloatingEmojis />
      <HeroSection />
      <DetailsSection />
      {/* <RSVPSection /> */}
      <Footer />
    </main>
  );
};

export default Index;
