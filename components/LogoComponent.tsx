import React from "react";
import Image from "next/image";
import logo from "@/public/images/logo.png";

const LogoComponent = () => {
  return (
    <Image
      src={logo}
      alt="logo"
      width={100}
      height={100}
      priority
      className="object-cover size-12"
    />
  );
};

export default LogoComponent;
