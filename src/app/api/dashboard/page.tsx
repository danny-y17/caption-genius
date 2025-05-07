import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    redirect('/login');
  }

  return <div>Welcome {session.user.email}</div>;
}
