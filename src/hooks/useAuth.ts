import { useSupabase } from '@/components/Providers';

export const useAuth = () => {
  const { session } = useSupabase();
  return { session };
}; 