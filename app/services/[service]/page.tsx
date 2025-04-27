import { Footer } from "@/components/home/Footer";
import Header from "@/components/home/Header";
import React from "react";
import { HeroSection } from "@/components/services/service/HeroSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServiceFromServicesList } from "@/utils/functions";
import { ServiceType } from "@/types/service";
import { prisma } from "@/lib/prisma";

type ServicePageProps = {
  params: Promise<{ service: string }>;
};

const getPersonnelsLength = async (service: string) => {
  const personnels = await prisma.personnelInfo.findMany({
    where: {
      job: service,
    },
  });
  return personnels.length;
};

async function ServicePage({ params }: ServicePageProps) {
  const { service: serviceName } = await params;

  const service = getServiceFromServicesList(serviceName);
  const personnelsLength = await getPersonnelsLength(serviceName);

  if (!serviceName || !service) {
    return (
      <main>
        <Header />
        <div className="container mx-auto p-4">
          <div className="flex flex-col items-center justify-center h-[70dvh] gap-2">
            <h1 className="text-4xl font-bold">Service non trouvé</h1>
            <Link href="/services">
              <Button> Retour à la page des services</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      {/* <Service */}
      <HeroSection
        service={service as ServiceType}
        personnelsLength={personnelsLength}
      />
      {/* FOOTER */}
      <Footer />
    </main>
  );
}

export default ServicePage;
