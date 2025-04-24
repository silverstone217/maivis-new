"use server";

import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { registerAuthSchema } from "@/schema/authSchema";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

// GET CURRENT USER

export const getUser = async () => {
  const session = await auth();
  return session?.user ?? null;
};

export type RegisterAuthType = z.infer<typeof registerAuthSchema>;

//   REGISTER OR LOGIN
export const registerAction = async (formData: RegisterAuthType) => {
  const validatedFields = registerAuthSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: true,
      message: "Veuillez remplir tous les champs",
      data: null,
    };
  }

  const { name, email, password, isLogin } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!isLogin) {
      if (user) {
        return {
          error: true,
          message: "Cette adresse email est déjà utilisée",
          data: null,
        };
      }

      //   HASH PASSWORD
      const hashedPassword = await hash(password, 10);

      //   CREATE USER
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
        },
      });

      if (!newUser) {
        return {
          error: true,
          message: "Une erreur est survenue lors de la création du compte",
          data: null,
        };
      }

      //   SIGN IN AFTER CREATION

      const login = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (!login) {
        return {
          error: true,
          message: "Une erreur est survenue lors de la connexion",
          data: null,
        };
      }

      return {
        error: false,
        message: "Votre compte a été créé avec succès",
        data: login,
      };
    }

    //   SIGN IN ONLY
    if (isLogin) {
      if (!user) {
        return {
          error: true,
          message: "Cette adresse email n'existe pas",
          data: null,
        };
      }
    }

    const isPasswordValid = await compare(password, user?.password || "");

    if (!isPasswordValid) {
      return {
        error: true,
        message: "Mot de passe incorrect",
        data: null,
      };
    }

    const login = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    if (!login) {
      return {
        error: true,
        message: "Une erreur est survenue lors de la connexion",
        data: null,
      };
    }

    return {
      error: false,
      message: "Connexion réussie",
      data: login,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Une erreur est survenue lors de la connexion",
      data: null,
    };
  }
};
