"use client";
import Link from "next/link";
import LogoComponent from "../LogoComponent";
import { Button } from "../ui/button";
import { LogOut, MenuIcon } from "lucide-react";
import SheetComponent from "../SheetComponent";
import { usePathname } from "next/navigation";
import useGetUser from "@/hooks/useGetUser";
import { getRoleDescription } from "@/utils/functions";
import { signOut } from "next-auth/react";
import { ADMIN_LINKS } from "@/utils/data";
import AvatarComponent from "../AvatarComponent";
import ToggleTheme from "../ToggleTheme";
import { SheetClose } from "../ui/sheet";

export default function HeaderSmallScreen() {
  return (
    <header className="flex items-center justify-between p-4 lg:hidden">
      {/* Logo link */}
      <Link href="/" className="flex items-center gap-0.5">
        <LogoComponent />
        <span className="text-xl font-bold mt-1">Maivis</span>
      </Link>

      {/* Menu button */}
      <MenuButton />
    </header>
  );
}

const MenuButton = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.includes(path);

  const { user } = useGetUser();
  const roleDescription = getRoleDescription(user?.role);

  const handleLogout = () => {
    signOut({ redirectTo: "/" });
  };

  return (
    <SheetComponent
      trigger={
        <Button variant={"outline"} size={"icon"}>
          <MenuIcon className="size-6" />
        </Button>
      }
      title="Maivis"
      description={`Bienvenue, ${roleDescription}`}
      content={
        <div className="flex flex-col gap-4">
          {/* Links */}
          <div className="flex flex-col gap-1 flex-1 p-4 border-y">
            {ADMIN_LINKS.map((link) => (
              <SheetClose asChild key={link.id}>
                <Link
                  key={link.id}
                  href={link.href}
                  className={`py-2 hover:text-blue-500  
                transition-all duration-500 ease-in-out font-medium text-lg flex items-center gap-4
                ${isActive(link.href) ? "text-blue-500" : ""}
                `}
                >
                  <link.icon className="size-6" />
                  <span>{link.title}</span>
                </Link>
              </SheetClose>
            ))}
          </div>

          {/* Profile, logout, toggle theme */}
          <div className="flex flex-col gap-4 p-4">
            {/* toggle theme */}
            <ToggleTheme />

            {/* Profile avatar */}
            <Link href={"/profil"} className="flex items-center gap-2">
              <AvatarComponent />
              <div className="flex flex-col">
                <span className="text-sm font-medium capitalize">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            </Link>

            {/* logout btn */}
            <Button variant={"destructive"} onClick={handleLogout}>
              <LogOut className="size-4" />
              <span className="text-sm font-medium">Déconnexion</span>
            </Button>
          </div>
        </div>
      }
    />
  );
};
