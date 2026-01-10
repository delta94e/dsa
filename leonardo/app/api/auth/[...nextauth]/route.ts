import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Mock user for development
const MOCK_USER = {
  id: "mock-user-123",
  email: "demo@leonardo.ai",
  name: "Demo User",
  image: "https://i.pravatar.cc/150?u=demo@leonardo.ai",
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Demo Login",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "demo@leonardo.ai",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // In development, accept any credentials and return mock user
        // In production, you would validate against your database
        if (credentials?.email) {
          return {
            id: MOCK_USER.id,
            email: credentials.email,
            name: credentials.email.split("@")[0],
            image: `https://i.pravatar.cc/150?u=${credentials.email}`,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // Optional: custom sign-in page
  },
  // Secret for JWT encryption - in production use NEXTAUTH_SECRET env var
  secret:
    process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
