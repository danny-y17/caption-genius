// src/lib/auth/config.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import type { DefaultSession } from 'next-auth';
import { supabase } from '@/lib/supabase';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
    supabaseAccessToken?: string;
  }
}

export const authConfig: NextAuthOptions = {
  debug: true, // Enable debug logs
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            throw new Error('Email and password are required');
          }

          console.log('Attempting to sign in with:', credentials.email);

          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) {
            console.error('Supabase auth error:', error.message);
            throw new Error(error.message);
          }

          if (!data.user) {
            console.log('No user returned from Supabase');
            throw new Error('No user found');
          }

          console.log('Successfully authenticated user:', {
            id: data.user.id,
            email: data.user.email,
            hasSession: !!data.session,
            hasAccessToken: !!data.session?.access_token,
            accessTokenLength: data.session?.access_token?.length
          });

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email,
            supabaseAccessToken: data.session?.access_token,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback - User data:', {
          id: user.id,
          hasAccessToken: !!(user as any).supabaseAccessToken,
          accessTokenLength: (user as any).supabaseAccessToken?.length
        });
        token.id = user.id;
        token.supabaseAccessToken = (user as any).supabaseAccessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        console.log('Session callback - Token data:', {
          id: token.id,
          hasAccessToken: !!token.supabaseAccessToken,
          accessTokenLength: token.supabaseAccessToken?.length
        });
        session.user.id = token.id as string;
        session.supabaseAccessToken = token.supabaseAccessToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
