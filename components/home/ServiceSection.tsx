import React from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

const ServiceSection = () => {
  return (
    <section className=" py-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2">
        {/* how it works */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Nos services & <br /> Comment ça marche?
          </h1>
        </div>

        {/* grid services amd how it works */}
        <div className="flex flex-col gap-10">
          {/* personnels */}
          <div className="flex w-full flex-col gap-2 py-8 border-b-2 transition-all duration-500 ease-in-out ">
            <h3 className="text-2xl  font-bold text-gray-800 dark:text-gray-200">
              Personnels
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 tracking-wide leading-snug font-medium">
              {`Maivis, a mis votre disposition tout type de personnels, que vous pourriez avoir besoin afin d'entretenir
               votre maison.
               Vous trouverez divers personnels tel que des femmes de menage, des sentinelles, electriciens, chauffeurs, cuisinieres etc;
               Femmes comme hommes, Maivis recherche la qualité et aussi de toujours repondre à vos inquietudes.
               D'autre type de personnels seront ajoutés au fur et a mesure.
              `}
            </p>
          </div>

          {/* Reservations */}
          <div className="flex w-full flex-col gap-2 py-8 border-b-2  transition-all duration-500 ease-in-out">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Reservations
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 tracking-wide leading-snug font-medium">
              {`Automatisez votre vie, maison et quotidien, en reservant directement depuis votre telephone.
                  Vous pourrez choisir votre personnel, votre date et votre heure; et aussitot un personnel viendra accomplir
                  la tache ou service souhaité.
                  Controllez tout depuis votre smartphone et facilitez-vous la vie avec Maivis.
              `}
            </p>
          </div>

          {/* personnels */}
          <div className="flex w-full flex-col gap-2 py-8 border-b-2 transition-all duration-500 ease-in-out">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Plateforme
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 tracking-wide leading-snug font-medium">
              {`Telecharger l'application mobile disponible sur tous les stores (Google play store, Apple store etc...);
                  afin de commencer à reserver un personnel pour votre service.
                  Maivis veut votre confort alors, rejoignez dé maintenant notre communauté.
              `}
            </p>

            {/* link app */}
            <Button variant={"outline"} className="mt-2">
              <Link
                href={"#"}
                className="flex items-center gap-3 justify-center"
              >
                <span className="flex-shrink-0">Telecharger ici</span>
                <Download />
              </Link>
            </Button>
          </div>

          {/* More and Contact */}
          <div className="flex w-full flex-col gap-2 py-8 transition-all duration-500 ease-in-out border-b-2">
            <h3 className="text-2xl  font-bold text-gray-800 dark:text-gray-200">
              {`Pour plus d'infos...`}
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 tracking-wide leading-snug font-medium">
              {`Maivis garantit votre securité, la quatlité du travail de ses personnels etc.
                  si vous avez des question ou des inquietudes ?
              `}
            </p>

            {/* more and contact */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <Button variant={"link"}>
                <Link href={"#"}>
                  <span className="flex-shrink-0">En savoir plus</span>
                </Link>
              </Button>

              <Button>
                <Link href={"#"}>
                  <span className="flex-shrink-0">Nous contacter</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
