import { getUser } from "@/actions/auth-actions";
import Header from "@/components/home/Header";
import LogoutBtn from "@/components/LogoutBtn";
import ToggleTheme from "@/components/ToggleTheme";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const user = await getUser();
  return (
    <main>
      <Header />
      <div className="flex  p-4 flex-col items-center justify-center h-[60vh] gap-4">
        <h1 className="text-4xl font-bold">Maivis</h1>
        <p className="text-2xl">
          Meilleure application pour reserver un service de maison fait par des
          professionnels!
        </p>
        <Link href="/connexion">
          <Button>Commencer maintenant</Button>
        </Link>
        <ToggleTheme />
        {user && <LogoutBtn />}
      </div>
    </main>
  );
}
