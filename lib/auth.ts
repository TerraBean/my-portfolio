import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { neon } from '@neondatabase/serverless';

// Get the database URL from environment variables - ensure it's a string
const DATABASE_URL = process.env.DATABASE_URL || '';

// Create a SQL client
const authSql = neon(DATABASE_URL);

// Extend the built-in session types
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
}

// Extend the JWT payload
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find the user with the provided email
          const users = await authSql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `;

          if (users.length === 0) {
            return null;
          }

          const user = users[0];

          // In a real app, you would verify the password with bcrypt
          // For now, we'll use a simple comparison for development
          const passwordMatch = credentials.password === user.password;

          if (!passwordMatch) {
            return null;
          }

          // Return user data (excluding password)
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || null,
          } as any; // Use type assertion to bypass TypeScript check
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || '',
};
