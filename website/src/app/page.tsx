import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Why } from "@/components/Why";
import { Features } from "@/components/Features";
import { TechStack } from "@/components/TechStack";
import { Screenshots } from "@/components/Screenshots";
import { Privacy } from "@/components/Privacy";
import { DownloadSection } from "@/components/Download";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Why />
        <Features />
        <TechStack />
        <Screenshots />
        <Privacy />
        <DownloadSection />
      </main>
      <Footer />
    </>
  );
}
