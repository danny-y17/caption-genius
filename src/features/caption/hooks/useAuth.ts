import { useSupabase } from '@/components/Providers';

// logic for authentication
export const useAuth = () => {
  const { session } = useSupabase();
  return { session };
}; 