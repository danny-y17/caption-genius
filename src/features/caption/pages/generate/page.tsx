'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { useSupabase } from '@/components/Providers';
import { useNiches } from '@/features/niche/hooks/useNiches';
import { toast } from 'react-hot-toast';

export default function GeneratePage() {
  const { session } = useSupabase();
  const router = useRouter();
  const { niches, isLoading: isLoadingNiches } = useNiches();
  const [input, setInput] = useState('');
  const [niche, setNiche] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error('Please sign in to generate captions');
      router.push('/login');
      return;
    }

    if (!input.trim()) {
      toast.error('Please enter some context for your caption');
      return;
    }

    if (!niche) {
      toast.error('Please select a niche');
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratedCaption('');

      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ input, niche }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate caption');
      }

      setGeneratedCaption(data.caption);
      toast.success('Caption generated successfully!');
    } catch (error) {
      console.error('Error generating caption:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate caption');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCaption);
      toast.success('Caption copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy caption');
    }
  };

  const nicheOptions = niches.map(niche => ({
    value: niche.name,
    label: niche.name,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-12">
          <Container>
            <div className="max-w-3xl mx-auto">
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
                  Generate Caption
                </Heading>
                <Text className="text-foreground/60 mt-2 text-lg">
                  Create engaging social media captions for your business
                </Text>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="niche" className="text-sm font-medium text-foreground">
                      Select Your Niche
                    </label>
                    <Select
                      id="niche"
                      value={niche}
                      onValueChange={setNiche}
                      options={nicheOptions}
                      placeholder="Choose your business niche..."
                      className="w-full"
                      disabled={isLoadingNiches}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="input" className="text-sm font-medium text-foreground">
                      Provide Context
                    </label>
                    <Textarea
                      id="input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Describe your post, product, or service. What makes it special? What's the main message you want to convey?"
                      className="min-h-[120px] w-full"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isGenerating || isLoadingNiches}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Caption
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>

              {generatedCaption && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <Heading variant="h2" className="text-xl font-semibold text-foreground">
                      Generated Caption
                    </Heading>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="text-foreground/60 hover:text-foreground hover:bg-primary/10"
                    >
                      Copy
                    </Button>
                  </div>
                  <Text className="text-foreground/80 text-lg leading-relaxed whitespace-pre-wrap">
                    {generatedCaption}
                  </Text>
                </motion.div>
              )}
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
} 