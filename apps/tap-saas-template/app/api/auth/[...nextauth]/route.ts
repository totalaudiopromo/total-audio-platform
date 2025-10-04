import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const demoUser: DemoUser = {
  id: 'demo-user',
  name: 'Template Founder',
  email: process.env.DEMO_USER_EMAIL ?? 'founder@totalaudiopromo.com',
  password: process.env.DEMO_USER_PASSWORD ?? 'buildfast',
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Demo Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const isValid =
          credentials.email.toLowerCase() === demoUser.email.toLowerCase() &&
          credentials.password === demoUser.password;

        if (!isValid) {
          return null;
        }

        return {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub ?? demoUser.id;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
