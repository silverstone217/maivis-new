import { getUser } from "@/actions/auth-actions";
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import ServiceSection from "@/components/home/ServiceSection";
import { Footer } from "@/components/home/Footer";
export default async function Home() {
  const user = await getUser();
  return (
    <main>
      {/* HEADER */}
      <Header />
      {/* HERO SECTION */}
      <HeroSection />
      {/* SERVICE SECTION */}
      <ServiceSection />
      {/* FOOTER */}
      <Footer />
    </main>
  );
}
