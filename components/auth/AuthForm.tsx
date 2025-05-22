"use client";

import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { isEmptyString } from "@/utils/functions";
import { toast } from "sonner";
import { registerAction, RegisterAuthType } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "../ui/label";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const { update } = useSession();

  const isBtnDisabled = useMemo(() => {
    if (isLoading) return true;
    if (isLogin && (isEmptyString(password) || isEmptyString(email)))
      return true;
    if (
      !isLogin &&
      (isEmptyString(password) || isEmptyString(email) || isEmptyString(name))
    )
      return true;
    return false;
  }, [email, password, isLoading, name, isLogin]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData: RegisterAuthType = {
        name: name.trim().toLocaleLowerCase(),
        email: email.trim().toLocaleLowerCase(),
        password: password.trim(),
        isLogin,
      };

      const res = await registerAction(formData);

      if (res?.error) {
        toast.error(res.message, {
          description: "Veuillez réessayer!",
          duration: 2500,
        });
        return;
      }

      toast.success(res.message, {
        description: "Vous êtes connecté",
      });

      setTimeout(async () => {
        router.refresh();
        await update();
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de la connexion", {
        description: "Veuillez réessayer plus tard",
        duration: 2500,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          {isLogin ? "Connexion au compte" : "Créer un compte"}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {isLogin
            ? "Connectez-vous pour accéder à votre espace."
            : "Créez un compte pour commencer."}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom (uniquement inscription) */}
        {!isLogin && (
          <div className="space-y-1">
            <Label htmlFor="name">Nom</Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                minLength={3}
                maxLength={60}
                className="pl-10"
                required
                autoComplete="name"
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="exemple@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              minLength={3}
              maxLength={60}
              className="pl-10"
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div className="space-y-1">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              id="password"
              name="password"
              type={isVisible ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              minLength={6}
              maxLength={12}
              className="pr-10 pl-10"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
              onClick={() => setIsVisible(!isVisible)}
              disabled={isLoading}
              aria-label={
                isVisible
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
            </Button>
          </div>
        </div>

        {/* Mot de passe oublié */}
        {isLogin && (
          <div className="text-right">
            <Link
              href="/forget-password"
              className="text-sm text-primary hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        )}

        {/* Bouton soumettre */}
        <Button
          type="submit"
          disabled={isBtnDisabled}
          className="w-full py-3 text-lg font-semibold"
        >
          {isLoading
            ? "Chargement..."
            : isLogin
            ? "Connexion"
            : "Créer un compte"}
        </Button>

        {/* Switch connexion / inscription */}
        <div className="text-center mt-4">
          <Button
            variant="link"
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            disabled={isLoading}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
          >
            {isLogin
              ? "Pas de compte ? Créez-en un"
              : "Déjà un compte ? Connectez-vous"}
          </Button>
        </div>
      </form>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-400 select-none">
        MAIVIS &copy; {new Date().getFullYear()} Tous droits réservés.
      </footer>
    </div>
  );
}
