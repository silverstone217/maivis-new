"use client";

import { AUTH_CONTENT } from "@/utils/data";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import logo from "@/public/images/logo.png";

export default function LeftSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % AUTH_CONTENT.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentContent = useMemo(() => AUTH_CONTENT[index], [index]);

  return (
    <section className="hidden md:flex flex-col justify-between w-full max-w-lg relative overflow-hidden shadow-lg">
      {/* Background image with overlay */}
      <Image
        src={currentContent.image}
        alt={currentContent.title}
        fill
        priority
        className="object-cover brightness-75 transition-opacity duration-700 ease-in-out"
      />

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-8 text-white">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <Image
            src={logo}
            alt="logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <h1 className="text-2xl font-semibold tracking-wide select-none">
            Maivis
          </h1>
        </div>

        {/* Text content */}
        <div className="space-y-4 max-w-xs">
          <h2 className="text-3xl font-extrabold leading-tight">
            {currentContent.title}
          </h2>
          <p className="text-sm opacity-90">{currentContent.description}</p>
        </div>

        {/* Pagination dots */}
        <div className="flex gap-3 mt-6 justify-start">
          {AUTH_CONTENT.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Afficher la slide ${idx + 1}`}
              className={`h-2 rounded-full transition-colors duration-300 ease-in-out ${
                index === idx
                  ? "w-8 bg-primary"
                  : "w-4 bg-white/50 hover:bg-white"
              }`}
              onClick={() => setIndex(idx)}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
