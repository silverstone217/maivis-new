"use client";
import { HOME_LINKS } from "@/utils/data";
import LogoComponent from "../LogoComponent";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 pt-5 border-t border-gray-200 dark:border-gray-700 mt-10">
      <div className="container mx-auto p-4 minh-[20dvh] flex flex-col gap-8 justify-between">
        {/* Logo and links */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <LogoComponent />
            <span className="text-xl font-bold">Maivis</span>
          </div>
          {/* description */}
          <p className="text-sm text-gray-500 max-w-lg">
            {`  Maivis est une plateforme de services de maîtrise de maison.
            Nous vous proposons des services de qualité pour tous vos besoins.
            Nous sommes une équipe de professionnels qui s'engage à vous
            offrir des services de qualité.`}
          </p>

          {/* social media */}
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <span className="text-sm text-gray-500 px-2 py-0.5 border rounded-lg">
              @maivis
            </span>
            <span className="text-sm text-gray-500 px-2 py-0.5 border rounded-lg">
              +243 07 00 00 00 00
            </span>
            <span className="text-sm text-gray-500 px-2 py-0.5 border rounded-lg">
              maivis@gmail.com
            </span>
          </div>

          {/* links */}
          <div className="flex flex-col gap-2 mt-4">
            <span className="text-sm font-bold underline ">Liens utils</span>
            <div className="flex items-center gap-2 flex-wrap">
              {HOME_LINKS.filter((link) => !link.isProtected).map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="hover:underline "
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* All rights reserved */}
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-gray-500 text-center w-full">
            &copy; {new Date().getFullYear()} Maivis. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
