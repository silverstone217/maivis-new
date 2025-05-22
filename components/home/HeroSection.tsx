import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { HandPlatter, Hammer } from "lucide-react";
import HeroSectionVideo from "./HeroSectionVideo";

function HeroSection() {
  return (
    <section className="relative ">
      {/* container */}
      <div
        className="w-full flex flex-col justify-center items-center gap-2 relative min-h-dvh
      transition-all ease-in-out duration-500 pt-20 
      "
      >
        {/* Absolute video */}

        <div
          className="w-full absolute inset-0 bg-secondary  overflow-hidden mx-auto brightness-75 -z-0 
        transition-all ease-in-out duration-500"
        >
          <HeroSectionVideo />
        </div>

        {/* Texts and Btns */}
        <div
          className="w-full max-w-xl xl:max-w-3xl mx-auto flex flex-col gap-8 py-8 flex-1 items-cente justify-center
        z-10 transition-all ease-in-out duration-500  h-full px-4
        "
        >
          {/* title */}
          <h2
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-pretty capitalize
          text-center text-white bg-clip-text dark:text-white
          "
          >
            Qualité et Services bien fourni par nos professionnels pour votre
            maison.
          </h2>

          {/* desc */}
          <p className="text-sm md:text-base lg:text-lg text-pretty text-center text-gray-300 max-w-2xl mx-auto">
            Maivis est une plateforme qui simplifie l&apos;entretien de votre
            maison. Trouvez des professionnels qualifiés pour le ménage, le
            jardinage et le bricolage. Réservez vos services en quelques clics,
            en toute confiance.
          </p>

          {/* Btns */}
          <div className="w-full flex items-center justify-center flex-wrap gap-4 md:gap-8 xl:px-8 md:grid md:grid-cols-2">
            <Link href={"/services"} className="w-full sm:w-[90%] md:w-full">
              <Button className="items-center justify-center flex gap-4 px-6 md:px-8 py-5 md:py-6 w-full">
                <HandPlatter className="size-5 md:size-6 shrink-0 text-white dark:text-white" />
                <span className="font-medium text-white dark:text-white">
                  Voire les services
                </span>
              </Button>
            </Link>

            <Link href={"#"} className="w-full sm:w-[90%] md:w-full">
              <Button className="items-center justify-center flex gap-4 px-6 md:px-8 py-5 md:py-6 w-full">
                <Hammer className="size-5 md:size-6 shrink-0 text-white dark:text-white" />
                <span className="font-medium text-white dark:text-white">
                  Devenir un personnel
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
