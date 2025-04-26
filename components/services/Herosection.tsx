import React from "react";
import Image from "next/image";
import serviceImg from "@/public/images/service1.jpg";

const Herosection = () => {
  return (
    <section className="w-full h-full flex flex-col gap-6 transition-all duration-500 ease-in-out">
      <div className="container mx-auto relative transition-all duration-500 ease-in-ou">
        <Image
          src={serviceImg}
          alt="service"
          width={1000}
          height={1000}
          className="w-full h-[350px] object-cover brightness-90"
          priority
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <div
          className="absolute top-0 left-0 w-full h-full flex flex-col gap-2
        items-center justify-center p-4 transition-all duration-500 tracking-tight"
        >
          <h1 className="text-white text-4xl font-bold">Services</h1>
          <p className="text-white lg:text-lg max-w-lg text-center">
            Parcourez nos services et trouvez le meilleur pour votre maison ou
            selon votre besoin.
          </p>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold">Nos services</h2>
      </div>
    </section>
  );
};

export default Herosection;
