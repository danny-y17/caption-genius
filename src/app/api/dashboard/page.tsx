import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authConfig);

  if (!session) redirect('/login');

  return <div>Welcome {session.user?.email}</div>;
}
