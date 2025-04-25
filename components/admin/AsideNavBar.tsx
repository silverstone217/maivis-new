"use client";
import { ADMIN_LINKS } from "@/utils/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import LogoComponent from "../LogoComponent";
import useGetUser from "@/hooks/useGetUser";
import AvatarComponent from "../AvatarComponent";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { getRoleDescription } from "@/utils/functions";
import { signOut } from "next-auth/react";
import ToggleTheme from "../ToggleTheme";
function AsideNavBar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const { user } = useGetUser();
  const roleDescription = getRoleDescription(user?.role);

  const handleLogout = () => {
    signOut({ redirectTo: "/" });
  };

  return (
    <aside
      className="h-full overflow-x-hidden overflow-y-auto hidden lg:flex flex-col
    transition-all duration-500 ease-in-out gap-4
    max-w-[300px] border-r border-r-gray-200 dark:border-r-gray-800 py-4
    "
    >
      {/* Logo and / */}
      <Link href={"/"} className="flex items-center gap-0.5 px-4">
        <LogoComponent />
        <span className="text-xl font-bold mt-1">Maivis</span>
      </Link>

      {/* Links */}
      <nav
        className="flex flex-col gap-4 flex-1 p-4 border-y 
      border-y-gray-200 dark:border-y-gray-800"
      >
        {ADMIN_LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={`flex items-center gap-4 text-lg font-medium ${
              isActive(link.href) ? "text-blue-500" : ""
            }
            hover:text-blue-500 transition-all duration-300 ease-in-out
            `}
          >
            <link.icon className="size-6" />
            {link.title}
          </Link>
        ))}
      </nav>

      {/* profile, logout, and welcome text */}
      <div className="flex items-center gap-4 p-4 flex-col">
        {/* Welcome text */}
        <span
          className="text-sm font-medium
        text-gray-500 max-w-[200px]  text-pretty
        "
        >
          Bienvenue {roleDescription}
        </span>

        {/* toggle theme */}
        <div className="flex items-center gap-2 w-full justify-start">
          <ToggleTheme />
          <span className="text-sm font-medium">Thème</span>
        </div>

        {/* Profile avatar */}
        <Link
          href={"/profil"}
          className="flex items-center gap-2 justify-start"
        >
          <AvatarComponent />
          <div className="flex flex-col">
            <span className="text-sm font-medium capitalize">{user?.name}</span>
            <span className="text-xs text-gray-500">{user?.email}</span>
          </div>
        </Link>

        {/* Logout button */}
        <Button
          variant={"destructive"}
          className="text-sm font-medium  w-full"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          <span className="text-sm font-medium">Déconnexion</span>
        </Button>
      </div>
    </aside>
  );
}

export default AsideNavBar;
