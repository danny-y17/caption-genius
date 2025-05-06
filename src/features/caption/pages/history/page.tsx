'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { Database } from '@/lib/supabase/types';

interface Caption {
  id: string;
  created_at: string;
  generated_caption: string;
  prompt: string;
  niche_id: string;
  user_id: string;
  niches?: {
    name: string;
  };
}

export default function HistoryPage() {
  const { session } = useAuth();
  const [history, setHistory] = useState<Caption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageInput, setPageInput] = useState('');
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (session?.user?.id) {
      fetchHistory();
    }
  }, [session, currentPage]);

  const fetchHistory = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Get total count
      const { count } = await supabase
        .from('captions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      setTotalCount(count || 0);

      // Get paginated captions with niche information
      const { data, error } = await supabase
        .from('captions')
        .select(`
          *,
          niches (
            name
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load caption history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Caption copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy caption');
    }
  };

  const handleDelete = async (id: string) => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from('captions')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      setHistory(history.filter(item => item.id !== id));
      toast.success('Caption deleted successfully');
    } catch (error) {
      console.error('Error deleting caption:', error);
      toast.error('Failed to delete caption');
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInput);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setPageInput('');
    } else {
      toast.error(`Please enter a page number between 1 and ${totalPages}`);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-12">
          <Container>
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <Heading variant="h1" className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Caption History
                </Heading>
                <Text className="text-foreground/60 mt-2 text-lg">
                  Review and manage your past caption generations
                </Text>
              </motion.div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : history.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground/80">
                                {new Date(item.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {item.niches && (
                                <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                                  {item.niches.name}
                                </span>
                              )}
                            </div>
                            {item.prompt && (
                              <Text className="text-sm text-foreground/60 italic">
                                "{item.prompt}"
                              </Text>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(item.generated_caption)}
                              className="text-foreground/60 hover:text-foreground hover:bg-primary/10"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="text-foreground/60 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Text className="text-foreground/80 text-lg leading-relaxed">{item.generated_caption}</Text>
                      </motion.div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex flex-col items-center gap-4 mt-8">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-colors text-foreground"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
                          <Text className="text-sm font-medium text-foreground">
                            Page {currentPage} of {totalPages}
                          </Text>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-colors text-foreground"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-center w-full">
                        <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200/50">
                          <Text className="text-sm text-foreground whitespace-nowrap">Go to page:</Text>
                          <input
                            type="text"
                            value={pageInput}
                            onChange={handlePageInputChange}
                            className="w-16 px-2 py-1 text-sm rounded-lg border border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none bg-white/50 backdrop-blur-sm text-foreground placeholder:text-foreground/40"
                            placeholder="#"
                          />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="px-3 py-1 text-sm rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-colors text-foreground"
                          >
                            Go
                          </Button>
                        </form>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <Text className="text-foreground/60 text-lg mb-6">No caption history yet</Text>
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg"
                    onClick={() => window.location.href = '/caption'}
                  >
                    Generate New Caption
                  </Button>
                </motion.div>
              )}
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
} 