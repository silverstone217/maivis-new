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
  const { user } = useGetUser();
  const roleDescription = getRoleDescription(user?.role);

  const isActive = (path: string) => pathname.startsWith(path);

  const handleLogout = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-72 h-screen border-r border-gray-200 
    dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
    >
      {/* Header with logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <LogoComponent />
          <span className="text-2xl font-extrabold tracking-tight select-none text-gray-900 dark:text-gray-100">
            Maivis
          </span>
        </Link>
      </div>
      <div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto pb-4 gap-6">
        {/* Navigation links with scroll */}
        <div className="flex-1 px-4 py-6">
          <nav className="flex flex-col space-y-3">
            {ADMIN_LINKS.map(({ id, href, icon: Icon, title }) => (
              <Link
                key={id}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-lg font-medium transition-colors duration-200 ${
                  isActive(href)
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                }`}
                aria-current={isActive(href) ? "page" : undefined}
              >
                <Icon className="w-6 h-6" aria-hidden="true" />
                {title}
              </Link>
            ))}
          </nav>
        </div>

        {/* User profile and actions */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex flex-col gap-4 bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium select-none">
            Bienvenue, <span className="capitalize">{roleDescription}</span>
          </p>

          <Link
            href="/profil"
            className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <AvatarComponent />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">
                {user?.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ToggleTheme />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
              Thème
            </span>
          </div>

          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleLogout}
            aria-label="Se déconnecter"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default AsideNavBar;
