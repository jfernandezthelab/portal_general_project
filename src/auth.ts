import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// ── Role type matching the UserRole enum ──────────────────────────────────────
type UserRole = 'ADMIN' | 'CONSULTANT' | 'CLIENT_VIEWER' | 'CLIENT_EDITOR'

// ── Extend session type to include our custom fields ──────────────────────────
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      clientId: string
    } & DefaultSession['user']
  }
  interface User {
    role: UserRole
    clientId: string
  }
}

// ── Login input validation schema ─────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// ── Auth.js config ────────────────────────────────────────────────────────────
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        // Validate input shape
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        // Look up user
        const user = await prisma.user.findUnique({
          where: { email },
        })
        if (!user) return null

        // Verify password
        const passwordValid = await bcrypt.compare(password, user.passwordHash)
        if (!passwordValid) return null

        // Return user object — Auth.js puts this in the JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          clientId: user.clientId,
        }
      },
    }),
  ],

  callbacks: {
    // Add custom fields to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.clientId = user.clientId
      }
      return token
    },

    // Expose custom fields on session.user
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.clientId = token.clientId as string
      }
      return session
    },
  },
})
