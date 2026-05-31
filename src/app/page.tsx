import Navbar from "@/components/layout/Navbar";
import Footer from '@/components/layout/Footer';
import HeroSection from "./components/HeroSection";
import BridgeSection from "./components/BridgeSection";
import RolesSection from "./components/RolesSection";
import MenaSection from "./components/MenaSection";
import GallerySection from "./components/GallerySection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";

export default async function HomePage() {

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="grow">
        <HeroSection />
        <BridgeSection />
        <RolesSection />
        <MenaSection />
        <GallerySection />
        <TestimonialsSection />
        <CTASection />
      </div>
      <Footer />
    </main>
  )
}
