import Header from "@/components/home/Header";
import Herosection from "@/components/services/Herosection";
import React from "react";
import { ServiceList } from "@/components/services/ServiceList";
import { Footer } from "@/components/home/Footer";
function ServicesPage() {
  return (
    <main>
      {/* HEADER */}
      <Header />
      {/* HERO SECTION */}
      <div className="w-full pt-20">
        <Herosection />
      </div>
      {/* SERVICES */}
      <div className="container mx-auto p-4">
        <ServiceList />
      </div>
      {/* FOOTER */}
      <Footer />
    </main>
  );
}

export default ServicesPage;
