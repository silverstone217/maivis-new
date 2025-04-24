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

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const { update } = useSession();

  //   const [error, setError] = useState("");

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
    // setError("");

    try {
      const formData: RegisterAuthType = {
        name: name.trim().toLocaleLowerCase(),
        email: email.trim().toLocaleLowerCase(),
        password: password.trim(),
        isLogin: isLogin,
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
      console.log(error);
      toast.error("Une erreur est survenue lors de la connexion", {
        description: "Veuillez réessayer plus tard",
        duration: 2500,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 2500);
    }
  };

  return (
    <section className="w-full md:h-full">
      {/* container */}
      <div
        className="flex flex-col md:h-full w-full items-center justify-center gap-8 p-4 md:p-6 xl:p-8
      transition-all duration-500 ease-in-out
      "
      >
        {/* Top texts */}
        <div className="md:w-[90%] 2xl:w-[80%] w-full mx-auto flex flex-col gap-2 transition-all duration-500 ease-in-out">
          <h2 className="font-bold text-4xl text-pretty">
            {isLogin ? "Connexion au compte" : "Créer un compte"}
          </h2>
          <p className="text-sm xl:text-base">
            {isLogin
              ? "Connectez-vous à votre compte pour accéder à votre espace"
              : "Créez un compte pour accéder à votre espace"}
          </p>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-4 md:w-[90%] 2xl:w-[80%] w-full mx-auto
        transition-all duration-500 ease-in-out
        "
          onSubmit={handleSubmit}
        >
          {/* Name */}
          {!isLogin && (
            <div className="w-full relative">
              <User className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 text-sm xl:text-base font-medium"
                required
                autoComplete="name"
                name="name"
                id="name"
                disabled={isLoading}
                minLength={3}
                maxLength={60}
              />
            </div>
          )}

          {/* Email */}
          <div className="w-full relative">
            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 text-sm xl:text-base font-medium"
              required
              autoComplete="email"
              name="email"
              id="email"
              disabled={isLoading}
              minLength={3}
              maxLength={60}
            />
          </div>

          {/* Password */}
          <div className="w-full relative">
            <Lock className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={isVisible ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 text-sm xl:text-base font-medium"
              required
              autoComplete="current-password"
              name="password"
              id="password"
              disabled={isLoading}
              minLength={6}
              maxLength={12}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent hover:text-primary
              transition-all duration-300 ease-in-out cursor-pointer hover:dark:bg-transparent
              "
              onClick={() => setIsVisible(!isVisible)}
              disabled={isLoading}
              type="button"
            >
              {isVisible ? <Eye /> : <EyeOff />}
            </Button>
          </div>

          {/* forget password */}
          <Link href="/forget-password" className="w-fit self-end">
            <p className="text-sm opacity-70 text-gray-600">
              Mot de passe oublié ?
            </p>
          </Link>

          {/* Error */}
          {/* {error && <p className="text-destructive text-sm">{error}</p>} */}

          {/* Button submit*/}
          <Button
            type="submit"
            disabled={isBtnDisabled}
            className="cursor-pointer"
          >
            {isLoading
              ? "Chargement..."
              : isLogin
              ? "Connexion"
              : "Créer un compte"}
          </Button>

          {/* Link switch  auth*/}
          <Button
            variant={"ghost"}
            className="w-fit self-end hover:bg-transparent cursor-pointer
             hover:dark:bg-transparent"
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            disabled={isLoading}
          >
            <p className="text-sm opacity-70 text-gray-600">
              {isLogin
                ? " Pas de compte ? Créer un compte"
                : "Deja un compte ? Connexion"}
            </p>
          </Button>
        </form>

        {/* All rights reserved */}
        <p className="text-sm opacity-70 text-gray-600 fixed bottom-6">
          MAIVIS &copy; {new Date().getFullYear()} Tous droits réservés.
        </p>
      </div>
    </section>
  );
}
