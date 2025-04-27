import { Footer } from "@/components/home/Footer";
import Header from "@/components/home/Header";
import React from "react";

function BookingsPage() {
  return (
    <main>
      {/* HEADER */}
      <Header />
      {/* HERO SECTION */}
      <div className="container mx-auto p-4 pt-20 min-h-[65dvh]">
        <h1 className="text-4xl font-bold">Mes Reservations</h1>
      </div>
      {/* SERVICE SECTION */}

      {/* FOOTER */}
      <Footer />
    </main>
  );
}

export default BookingsPage;
