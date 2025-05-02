import 'next-auth';

declare module 'next-auth' {
  interface session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
} 