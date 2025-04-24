"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetUser from "@/hooks/useGetUser";
import React from "react";

const AvatarComponent = () => {
  const { user } = useGetUser();

  if (!user) return null;

  const image = user.image || "https://github.com/shadcn.png";
  const ShortName = (user.name || user.email?.split("@")[0] || "NN")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar>
      <AvatarImage src={image} />
      <AvatarFallback>{ShortName}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarComponent;
