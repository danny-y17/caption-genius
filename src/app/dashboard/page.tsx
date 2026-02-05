"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentCaption } from '@/components/dashboard/RecentCaption';
import { NicheButton } from '@/components/dashboard/NicheButton';
import { stats, popularNiches } from '@/data/dashboard';
import { Container } from '@/components/ui/container';
import { useSupabase } from '@/app/providers/Providers';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

interface RecentCaptionData {
  id: string;
  generated_caption: string;
  created_at: string;
  niches: {
    name: string;
  }[] | null;
}

export default function DashboardLanding() {
  const { session } = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recentCaptions, setRecentCaptions] = useState<RecentCaptionData[]>([]);
  const [loadingCaptions, setLoadingCaptions] = useState(true);

  useEffect(() => {
    if (!session && !loading) {
      router.push('/login');
    }
    setLoading(false);
  }, [session, loading, router]);

  useEffect(() => {
    const fetchRecentCaptions = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoadingCaptions(true);
        const { data, error } = await supabase
          .from('captions')
          .select(`
            id,
            generated_caption,
            created_at,
            niches (
              name
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(3)
          .returns<RecentCaptionData[]>();

        if (error) throw error;
        setRecentCaptions(data || []);
      } catch (error) {
        console.error('Error fetching recent captions:', error);
      } finally {
        setLoadingCaptions(false);
      }
    };

    fetchRecentCaptions();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Container>
        {/* Hero Section */}
        <div className="pt-24 pb-16 px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 shadow-lg mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground tracking-tight">
              Welcome, {session.user.email}
            </h1>
            <p className="text-lg text-foreground/80 mb-8 max-w-xl mx-auto">
              Your AI-powered caption generation dashboard
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => router.push('/caption')}
                className="px-6 py-3 rounded-xl font-semibold bg-primary text-white shadow-lg hover:bg-primary/90 transition"
              >
                Generate New Caption
              </button>
              <button 
                onClick={() => router.push('/history')}
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                View All
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 mb-12">
          {stats.map((stat, i) => (
            <StatsCard key={stat.label} {...stat} index={i} />
          ))}
        </div>

        {/* Recent Captions */}
        <div className="px-4 mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Recent Captions</h2>
              <Link 
                href="/history"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {loadingCaptions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : recentCaptions.length > 0 ? (
                recentCaptions.map((caption, i) => (
                  <RecentCaption
                    key={caption.id}
                    text={caption.generated_caption}
                    niche={caption.niches?.[0]?.name || 'General'}
                    date={new Date(caption.created_at).toLocaleDateString()}
                    index={i}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-foreground/60">No recent captions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Popular Niches */}
        <div className="px-4 mb-16">
          <div className="text-center mb-8">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-xs text-primary font-medium">Niche Markets</span>
            <h2 className="text-3xl font-bold mt-2 mb-2 text-foreground">Popular Niches</h2>
            <p className="text-foreground/80 max-w-xl mx-auto">Generate captions for these trending business categories</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularNiches.map((niche) => (
              <NicheButton
                key={niche}
                niche={niche}
                onClick={() => router.push(`/caption?niche=${niche}`)}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
} 
