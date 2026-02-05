'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSupabase } from '@/app/providers/Providers';
import { supabase } from '@/lib/supabase/client';

interface CaptionHistory {
  id: string;
  date: string;
  caption: string;
  prompt: string;
  niche: string;
  created_at: string;
}

interface CaptionRow {
  id: string;
  generated_caption: string;
  prompt: string;
  created_at: string;
  niches: {
    name: string;
  }[] | null;
}

export default function HistoryPage() {
  const { session } = useSupabase();
  const router = useRouter();
  const [history, setHistory] = useState<CaptionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchHistory = useCallback(async (page: number) => {
    try {
      setLoading(true);
      
      // Calculate the range for pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Get total count
      const { count } = await supabase
        .from('captions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session?.user.id);

      setTotalCount(count || 0);

      // Fetch paginated data with niche information
      const { data, error } = await supabase
        .from('captions')
        .select(`
          id,
          generated_caption,
          prompt,
          created_at,
          niches (
            name
          )
        `)
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const formattedHistory = ((data || []) as CaptionRow[]).map((item) => ({
        id: item.id,
        date: new Date(item.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        caption: item.generated_caption,
        prompt: item.prompt,
        niche: item.niches?.[0]?.name || 'General',
        created_at: item.created_at
      }));

      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, session?.user?.id]);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const page = Number(params.get('page')) || 1;
    setCurrentPage(page);
    fetchHistory(page);
  }, [session, router, fetchHistory]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('captions')
        .delete()
        .eq('id', id)
        .eq('user_id', session?.user.id);

      if (error) throw error;

      // Refresh the current page
      fetchHistory(currentPage);
    } catch (error) {
      console.error('Error deleting caption:', error);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    router.push(`/history?page=${newPage}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow pt-20">
        <section className="py-8 bg-background/80 backdrop-blur-sm">
          <Container>
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <Heading variant="h1" className="text-3xl">Caption History</Heading>
                <Text className="text-foreground/60 mt-1">
                  Review and manage your past caption generations
                </Text>
              </motion.div>

              <div className="space-y-6">
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground/80">{item.date}</span>
                          <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {item.niche}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(item.caption)}
                          className="text-foreground/60 hover:text-foreground"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-foreground/60 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Text className="text-sm text-foreground/60">Prompt: {item.prompt}</Text>
                      <Text className="text-foreground/80">{item.caption}</Text>
                    </div>
                  </motion.div>
                ))}
              </div>

              {history.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Text className="text-foreground/60">No caption history yet</Text>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push('/caption')}
                  >
                    Generate New Caption
                  </Button>
                </motion.div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Text className="text-foreground/60">
                    Page {currentPage} of {totalPages}
                  </Text>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </Container>
        </section>
      </div>
    </div>
  );
} 
