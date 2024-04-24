import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/libs/prismadb";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import LinkedInProvider from "next-auth/providers/linkedin";
import generateVerificationCode from "@/auth-utils";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sanduld724@gmail.com",
    pass: "ciem nyrk vmir nwvz",
  },
});
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        console.log("Authorizing with credentials:", credentials);

        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password");
          throw new Error("Invalid credentials");
        }

        let user;
        try {
          user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          console.log("User found:", user);
        } catch (error) {
          console.error("Error finding user:", error);
          throw new Error("Error during user lookup");
        }

        if (!user || !user.hashedPassword) {
          console.error("User not found or no password hash");
          throw new Error("Invalid credentials");
        }

        const isCorrectPass = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        console.log("Password verification result:", isCorrectPass);
        if (!isCorrectPass) {
          console.error("Password does not match");
          throw new Error("Invalid credentials");
        }

        // First, check if the user meets the standard authentication criteria
        if (user.isEmailVerified && user.partialLogin) {
          if (user.email === "sanduld724@yahoo.com") {
            console.log("Special handling for admin user");
            await prisma.user.update({
              where: { email: user.email },
              data: { isManager: true },
            });
            user.isManager = true; // Updating the local user object for immediate use
            return user;
          }
          return user; // Authentication success path for regular users
        }

        console.log("Authentication failed due to unmet conditions");
        throw new Error(
          "Authentication failed. Please complete the verification process or check the login status."
        );
      },
    }),
  ],

  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   // Check if this is a sign-in attempt with a temp auth token
    //   if (user.tempAuthToken && user.tempAuthTokenExpires) {
    //     const now = new Date();
    //     const tokenExpires = new Date(user.tempAuthTokenExpires);

    //     // Verify the token is not expired
    //     if (now < tokenExpires) {
    //       if(user.email){// Invalidate the tempAuthToken by clearing it and its expiration
    //       await prisma.user.update({
    //         where: { email: user.email },
    //         data: {
    //           tempAuthToken: null,
    //           tempAuthTokenExpires: null,
    //         },
    //       });

    //       return true; // Allow the sign-in
    //     }}
    //   }

    // Fallback to default behavior if not signing in with a temp auth token
    //   return true; // or false if you want to add additional checks
    // },
    async session({ session, user }) {
      // Temporarily bypass TypeScript's strict typing
      const extendedUser = user as any; // Use `any` or a more specific type that includes `isManager`

      if (extendedUser && session.user) {
        session.user.isManager = extendedUser.isManager;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
