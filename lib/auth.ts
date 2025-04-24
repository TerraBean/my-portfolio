import { NextAuthOptions, RequestInternal } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { neon } from '@neondatabase/serverless';
import bcrypt from "bcrypt";

// Get the database URL from environment variables - ensure it's a string
const DATABASE_URL = process.env.DATABASE_URL || '';

// Create a SQL client
const authSql = neon(DATABASE_URL);

// Extend the built-in types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  }
}

// Extend the JWT payload
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
  }
}

type DbUser = {
  id: string;
  email: string;
  password: string;
  name: string | null;
  role: string | null;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await authSql`
            SELECT * FROM users WHERE email = ${credentials.email}
          ` as DbUser[];

          const user = result[0];
          if (!user) return null;

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) return null;

          // Return user object matching the User interface
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: null
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};
