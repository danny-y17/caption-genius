import { useSupabase } from '@/app/providers/Providers';

// logic for authentication
export const useAuth = () => {
  const { session } = useSupabase();
  return { session };
}; 