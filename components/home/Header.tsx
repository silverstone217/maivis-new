"use client";

import { HOME_LINKS } from "@/utils/data";
import LogoComponent from "../LogoComponent";
import Link from "next/link";
import useGetUser from "@/hooks/useGetUser";
import ToggleTheme from "../ToggleTheme";
import LogoutBtn from "../LogoutBtn";
import AvatarComponent from "../AvatarComponent";
import SheetComponent from "../SheetComponent";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import HomeProfileMenu from "./HomeProfileMenu";

const Header = () => {
  const { user } = useGetUser();
  return (
    <header>
      {/* Container */}
      <div className="flex items-center justify-between p-4">
        {/* Logo link */}
        <Link href="/" className="flex items-center gap-0.5">
          <LogoComponent />
          <span className="text-xl font-bold mt-1">Maivis</span>
        </Link>

        {/* Others part for Big screens */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Links */}
          <nav className="flex items-center gap-2">
            {HOME_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`${
                  link.isProtected ? "hidden" : ""
                } p-2 border rounded-2xl border-transparent
                hover:opacity-70 hover:underline underline-offset-2
                transition-all duration-500 ease-in-out font-medium
                `}
              >
                {link.title}
              </Link>
            ))}
            {/* Admin link dashboard */}
            {/* {user && user.role.includes("ADMIN") && (
              <Link href="/dashboard">
                <Button variant={"outline"}> Dashboard</Button>
              </Link>
            )} */}
          </nav>
          {/* Btn for login or register  and Toggle theme */}
          <div className="flex items-center gap-4">
            {user ? <HomeProfileMenu /> : <LoginLink />}
            <ToggleTheme />
          </div>
        </div>
        {/* Small screen header */}
        <div className="lg:hidden">
          <SmallScreenHeader />
        </div>
      </div>
    </header>
  );
};

export default Header;

const SmallScreenHeader = () => {
  const { user } = useGetUser();
  return (
    <SheetComponent
      trigger={<MenuIcon className="size-6" />}
      title="Maivis"
      description="Meilleure application de reservaion de service de maison en ligne!"
      side="right"
      content={
        <div className="flex flex-col p-4 flex-1 border-t gap-4">
          {/* Links */}
          <nav className="flex flex-col gap-2 flex-1 pb-4 border-b">
            {HOME_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  "p-2  hover:opacity-70 hover:underline underline-offset-2 ",
                  link.isProtected ? "hidden" : "",
                  "transition-all duration-500 ease-in-out",
                  "font-medium text-xl"
                )}
              >
                {link.title}
              </Link>
            ))}

            {/* Admin link dashboard */}
            {user && user.role.includes("ADMIN") && (
              <Link
                href="/dashboard"
                className="text-blue-500 p-2 font-medium text-xl
                transition-all duration-500 ease-in-out
                "
              >
                Dashboard **
              </Link>
            )}
          </nav>
          {/* Btn for login or register  and Toggle theme */}
          <div className="flex gap-4 items-center flex-wrap">
            <ToggleTheme />
            {user ? <AvatarComponent /> : <LoginLink />}
          </div>
        </div>
      }
    />
  );
};

const LoginLink = () => (
  <Link href="/connexion">
    <Button>Connexion</Button>
  </Link>
);
