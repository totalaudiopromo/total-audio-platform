import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Mock user database - replace with your actual database
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "$2a$12$6/j1ELDXL9kns.Gq5h6Co.HGbDsS5b2FkfVbQEiA/3Cx1DYf1X732", // "password123"
  },
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const user = users.find(user => user.email === credentials.email);
        
        if (!user) {
          console.log("User not found:", credentials.email);
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        console.log("Password validation:", isValid);
        
        if (isValid) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
        
        console.log("Invalid password for user:", credentials.email);
        return null;
      }
    }),
    // Add Google provider if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && 
        process.env.GOOGLE_CLIENT_ID !== "your-google-client-id" ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    // Add Apple provider if credentials are available
    ...(process.env.APPLE_ID && process.env.APPLE_SECRET && 
        process.env.APPLE_ID !== "your-apple-id" ? [
      AppleProvider({
        clientId: process.env.APPLE_ID,
        clientSecret: process.env.APPLE_SECRET,
      })
    ] : []),
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
      if (token && session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-nextauth-secret",
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST }; 