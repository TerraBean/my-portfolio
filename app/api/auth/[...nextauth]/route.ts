import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

// Initialize the SQL client with the connection string from environment variables
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_kB0yUrqcg6pd@ep-black-glade-a46muedm-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

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
          console.log("Missing credentials");
          return null;
        }

        try {
          console.log("Attempting to authenticate user:", credentials.email);
          
          // Find the user in the database
          const result = await sql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `;

          console.log("Database query result:", result.length > 0 ? "User found" : "User not found");
          
          const user = result[0];

          if (!user) {
            console.log("User not found in database");
            return null;
          }

          // Compare the provided password with the stored hash
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("Password match:", passwordMatch);

          if (!passwordMatch) {
            console.log("Password does not match");
            return null;
          }

          console.log("Authentication successful");
          
          // Return user object without sensitive data
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            isAdmin: user.is_admin
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
