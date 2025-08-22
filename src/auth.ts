import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Manual check (contoh)
        if (
          credentials?.username === "masahmad" &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            name: "Mas Ahmad",
            email: "me@ahmadlabs.my.id",
            role: "admin",
          };
        }
        return null;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // token.role = (user as { role?: string }).role ?? "user";
        token.role = (user as JWT).role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // session.user.role = (token as { role?: string }).role ?? "user";
        session.user.role = (token as JWT).role ?? "user";
      }
      return session;
    },
  },
});
