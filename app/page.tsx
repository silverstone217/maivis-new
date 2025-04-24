import { getUser } from "@/actions/auth-actions";
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";

export default async function Home() {
  const user = await getUser();
  return (
    <main>
      {/* HEADER */}
      <Header />
      {/* HERO SECTION */}
      <HeroSection />
    </main>
  );
}
