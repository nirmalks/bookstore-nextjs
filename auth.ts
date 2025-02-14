import NextAuth, { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./db/prisma"
import Credentials from "next-auth/providers/credentials"
import { compare } from './lib/encrypt';
import { NextResponse } from "next/server";


const config = {
  adapter: PrismaAdapter(prisma),
  providers: [Credentials({
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      email: { type: 'email' },
      password: { type: 'password' },
    },
    authorize: async (credentials) => {
      if (credentials == null) return null

      // logic to verify if the user exists
      const user = await prisma.user.findFirst({
        where: {
          email: credentials.email as string
        }
      })

      if (user && user.password) {
        const hasMatched = await compare(credentials.password as string, user.password)
        if (hasMatched) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      }

      // return user object with their profile data
      return null
    },
  })
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      // If there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      return token
    },
    authorized({ request, auth }: any) {
      if (!request.cookies.get('sessionCartId')) {
        const sessionCartId = crypto.randomUUID();
        const newRequestHeaders = new Headers(request.headers)
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders
          }
        })
        response.cookies.set('sessionCartId', sessionCartId)
        return response
      } else {
        return true
      }
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  }
} satisfies NextAuthConfig
export const { handlers, signIn, signOut, auth } = NextAuth(config) 