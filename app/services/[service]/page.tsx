import { Footer } from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { HeroSection } from "@/components/services/service/HeroSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServiceFromServicesList } from "@/utils/functions";
import { ServiceType } from "@/types/service";
import { prisma } from "@/lib/prisma";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import React from "react";

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

export default async function ServicePage({ params }: ServicePageProps) {
  const { service: serviceName } = await params;

  const service = getServiceFromServicesList(serviceName);
  const personnelsLength = await getPersonnelsLength(serviceName);

  if (!serviceName || !service) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <Header />
        <section className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-auto p-6 flex flex-col items-center gap-4 shadow-lg border-0">
            <AlertTriangle size={48} className="text-orange-500" />
            <h1 className="text-2xl font-bold text-center">
              Service non trouvé
            </h1>
            <p className="text-muted-foreground text-center">
              Le service que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Link href="/services" className="w-full">
              <Button className="w-full mt-2" variant="outline">
                Retour à la page des services
              </Button>
            </Link>
          </Card>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="">
      <Header />
      <div className="min-h-[80svh] pt-10 flex items-center justify-center w-full">
        <HeroSection
          service={service as ServiceType}
          personnelsLength={personnelsLength}
        />
      </div>
      <Footer />
    </main>
  );
}
