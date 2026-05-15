import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Screenshots } from "@/components/Screenshots";
import { TechStack } from "@/components/TechStack";
import { Privacy } from "@/components/Privacy";
import { DownloadSection } from "@/components/Download";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Screenshots />
        <TechStack />
        <Privacy />
        <DownloadSection />
      </main>
      <Footer />
    </>
  );
}
