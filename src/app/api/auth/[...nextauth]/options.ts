import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/models/db.connect";
import UserModel from "@/models/user.model";

interface User {
  _id: string;
  username?: string;
  email: string;
  isVerified: boolean;
  isAcceptingMessage?: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email or Username",
          type: "text",
          placeholder: "jsmith@gmail.com / jsmith",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ): Promise<User | null | any> {
        await dbConnect();

        if (!credentials?.email || !credentials.password) {
          throw new Error("Both email and password are required.");
        }

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.email },
            ],
          });

          if (!user) {
            throw new Error("User not found.");
          }

          if (!user.isVerified) {
            throw new Error("User is not verified.");
          }

          const isMatch = await user.comparePassword(
            String(credentials.password)
          );

          if (!isMatch) {
            throw new Error("Invalid identifier or password.");
          }

          return {
            _id: user._id ? user._id.toString() : "",
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            isAcceptingMessage: user.isAcceptingMessage,
          };
        } catch (error) {
          console.error(error);
          throw new Error(String(error) || "An error occurred.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username || "";
        token.isVerified = user.isVerified || false;
        token.isAcceptingMessage = user.isAcceptingMessage || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id,
          username: token.username || "",
          isVerified: token.isVerified,
          isAcceptingMessage: token.isAcceptingMessage,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
