import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/Providers';
import { supabase } from '@/lib/supabase/client';

interface AuthState {
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface SignUpCredentials {
  email: string;
  password: string;
  fullName: string;
}

// logic for authentication
export const useAuth = () => {
  const { session } = useSupabase();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    loading: false,
    error: null,
  });

  const login = async ({ email, password, rememberMe = false }: LoginCredentials) => {
    setAuthState({ loading: true, error: null });

    try {
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message.includes('Invalid login credentials') 
          ? 'Invalid email or password' 
          : error.message
        : 'An error occurred during login';
      
      setAuthState({ loading: false, error: errorMessage });
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async ({ email, password, fullName }: SignUpCredentials) => {
    setAuthState({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Auto-sign in after successful signup
        await supabase.auth.signInWithPassword({ email, password });
        router.push('/dashboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign up';
      setAuthState({ loading: false, error: errorMessage });
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getRememberedEmail = () => {
    return localStorage.getItem('rememberedEmail');
  };

  return {
    session,
    ...authState,
    login,
    signUp,
    signOut,
    getRememberedEmail,
  };
}; 