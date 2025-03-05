import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import { JWT } from 'next-auth/jwt';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      trialEnds?: Date;
    }
  }
  interface User {
    id: string;
    email: string;
    trialEnds: Date;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For demo account
        if (credentials.email === 'test@example.com' && credentials.password === 'demo123') {
          // Create or get demo user
          const user = await prisma.user.upsert({
            where: { email: 'test@example.com' },
            update: {},
            create: {
              email: 'test@example.com',
              trialEnds: addDays(new Date(), 2)
            },
          });

          return {
            id: user.id,
            email: user.email,
            trialEnds: user.trialEnds
          };
        }

        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin'
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | null }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.trialEnds = user.trialEnds;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.trialEnds = token.trialEnds as Date;
      }
      return session;
    }
  }
}; 