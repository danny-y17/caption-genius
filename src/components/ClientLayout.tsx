'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Providers from './Providers';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Add global fetch interceptor to handle session expiration
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      // Check for session expiration
      if (response.headers.get('X-Session-Expired') === 'true') {
        console.log('Session expired detected in global interceptor');
        await supabase.auth.signOut();
        router.push('/login');
        return response;
      }

      // Check response body for session expiration
      const clone = response.clone();
      try {
        const data = await clone.json();
        if (data.error === 'SESSION_EXPIRED') {
          console.log('Session expired detected in response body');
          await supabase.auth.signOut();
          router.push('/login');
        }
      } catch (e) {
        // Not JSON, ignore
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [router]);

  return (
    <Providers>
      {children}
    </Providers>
  );
} 