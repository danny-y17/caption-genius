// /app/caption/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Copy, Heart, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/Providers';
import { supabase } from '@/lib/supabase/client';

interface CaptionResponse {
  caption: string;
  error?: string;
}

interface RecentCaption {
  id: string;
  generated_caption: string;
  created_at: string;
  prompt: string;
  niches: {
    name: string;
  }[] | null;
}

const niches = [
  { id: 'yoga', name: 'Yoga Studio', icon: '🧘‍♀️' },
  { id: 'coffee', name: 'Indie Coffee Shop', icon: '☕' },
  { id: 'fitness', name: 'Fitness Trainer', icon: '💪' },
  { id: 'fashion', name: 'Fashion Brand', icon: '👗' },
  { id: 'salon', name: 'Beauty Salon', icon: '💇‍♀️' },
  { id: 'food', name: 'Food Blogger', icon: '🍽️' },
];

export default function CaptionGeneratorPage() {
  const { session } = useSupabase();
  const [niche, setNiche] = useState(niches[0].id);
  const [input, setInput] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const [recentCaptions, setRecentCaptions] = useState<RecentCaption[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingCaptions, setLoadingCaptions] = useState(true);

  const fetchRecentCaptions = useCallback(async () => {
    try {
      setLoadingCaptions(true);
      const { data, error } = await supabase
        .from('captions')
        .select(`
          id,
          generated_caption,
          created_at,
          prompt,
          niches (
            name
          )
        `)
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * 5, currentPage * 5 - 1)
        .returns<RecentCaption[]>();

      if (error) throw error;

      // Get total count
      const { count } = await supabase
        .from('captions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session?.user.id);

      setTotalPages(Math.ceil((count || 0) / 5));
      setRecentCaptions(data || []);
    } catch (error) {
      console.error('Error fetching recent captions:', error);
    } finally {
      setLoadingCaptions(false);
    }
  }, [session?.user?.id, currentPage]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchRecentCaptions();
    }
  }, [session, currentPage, fetchRecentCaptions]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setCaption('');
    setError(null);

    try {
      const res = await fetch('/api/generate-caption', {
        method: 'POST',
        body: JSON.stringify({ 
          niche: niches.find(n => n.id === niche)?.name, 
          input 
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json() as CaptionResponse;
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate caption');
      }

      setCaption(data.caption);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-light relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50"></div>
        <div className="absolute inset-0 bg-pattern opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-surface/50"></div>
      </div>

      {/* Animated Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 pt-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              ✨ AI-Powered Captions
            </span>
          </motion.div>
          <h1 className="text-6xl font-bold mb-6 text-foreground tracking-tight">
            Create Captivating
            <br />
            Social Media Content
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Generate engaging social media captions in seconds with our AI-powered tool. Perfect for businesses, creators, and social media managers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-soft"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Select Your Business Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {niches.map((n) => (
                    <motion.button
                      key={n.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setNiche(n.id)}
                      className={`p-4 rounded-xl border-2 transition-all hover-lift ${
                        niche === n.id
                          ? 'border-primary bg-primary/10 shadow-soft'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-3xl mb-2 floating"
                      >
                        {n.icon}
                      </motion.div>
                      <div className="text-sm font-medium text-foreground">{n.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Describe Your Post
                </label>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl bg-white border border-gray-200 text-foreground p-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    placeholder="e.g., promoting a morning yoga class with a special discount..."
                  />
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={loading || !input}
                className="w-full flex items-center justify-center space-x-3 px-6 py-3 rounded-xl font-medium bg-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating<span className="loading-dots"></span></span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Caption</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-foreground">Generated Caption</h2>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-foreground border border-gray-200 transition-all duration-200 ${
                      copied ? 'bg-green-500/20 text-green-600' : ''
                    }`}
                    title="Copy to clipboard"
                  >
                    <Copy className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-foreground border border-gray-200 transition-all duration-200"
                    title="Save to favorites"
                  >
                    <Heart className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-48"
                  >
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </motion.div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-red-500/10 text-red-600 rounded-lg border border-red-500/20"
                  >
                    {error}
                  </motion.div>
                ) : caption ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="prose prose-invert max-w-none bg-gray-50 p-6 rounded-xl shadow-soft"
                  >
                    <p className="whitespace-pre-wrap text-foreground">{caption}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-foreground/60 h-48 flex items-center justify-center bg-gray-50 rounded-xl"
                  >
                    <div>
                      <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary floating" />
                      <p>Your caption will appear here</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-soft mt-8 hover:shadow-xl transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-foreground">Recent Captions</h2>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/history')}
              className="px-4 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-foreground border border-gray-200 transition-all duration-200 flex items-center space-x-2"
            >
              <History className="w-4 h-4" />
              <span className="text-primary hover:text-primary/80 transition-colors font-medium">
                View All
              </span>
            </motion.button>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            {loadingCaptions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : recentCaptions.length > 0 ? (
              <div className="space-y-4">
                {recentCaptions.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground/80">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {item.niches?.[0]?.name || 'General'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.generated_caption);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy caption"
                      >
                        <Copy className="w-4 h-4 text-foreground/70" />
                      </button>
                    </div>
                    <p className="text-foreground/80 text-sm leading-relaxed">{item.generated_caption}</p>
                  </motion.div>
                ))}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors text-foreground"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="text-sm font-medium">Previous</span>
                    </button>
                    <span className="text-sm font-medium text-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors text-foreground"
                    >
                      <span className="text-sm font-medium">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-foreground/60">No recent captions</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: '🚀',
              title: 'Lightning Fast',
              description: 'Generate captions in seconds with our advanced AI technology'
            },
            {
              icon: '🎯',
              title: 'Business Focused',
              description: 'Optimized for various business types and social media platforms'
            },
            {
              icon: '✨',
              title: 'Engaging Content',
              description: 'Create captions that resonate with your audience'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4 floating">{feature.icon}</div>
              <h3 className="text-lg font-medium text-foreground mb-2">{feature.title}</h3>
              <p className="text-foreground/80">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Spacing */}
        <div className="h-16"></div>
      </div>
    </div>
  );
}
