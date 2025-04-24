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
    <section className="md:flex hidden h-full w-full">
      <div
        className="flex flex-col items-center justify-center gap-4 relative h-full 
      w-full transition-all duration-500 ease-in-out"
      >
        {/* absolute image */}
        <Image
          src={currentContent.image}
          alt={currentContent.title}
          className="w-full h-full object-cover
            absolute inset-0 brightness-75 rounded-2xl
            transition-all duration-500 ease-in-out
        "
          width={1200}
          height={1800}
          priority
        />
        {/* content */}
        <div
          className="flex flex-col items-center justify-between gap-4 z-10 h-full p-6 xl:p-8
        transition-all duration-500 ease-in-out
        "
        >
          {/* Logo */}
          <div className="flex items-center justify-start w-full">
            <Image
              src={logo}
              alt="logo"
              width={100}
              height={100}
              className="object-cover size-16"
            />
            <h1 className="text-2xl font-bold text-white">Maivis</h1>
          </div>

          <div className="flex flex-col gap-2 transition-all duration-500 ease-in-out">
            <h1 className="text-4xl font-bold text-white text-pretty">
              {currentContent.title}
            </h1>
            <p className="text-white text-sm xl:text-base">
              {currentContent.description}
            </p>

            {/* buttons tab */}
            <div className="flex items-center justify-center gap-2 mt-3 transition-all duration-500 ease-in-out">
              {AUTH_CONTENT.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-12 h-2 rounded-2xl cursor-pointer 
                    
                    ${index === idx ? "bg-primary" : "bg-white"}`}
                  onClick={() => setIndex(idx)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
