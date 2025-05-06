'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const FEATURES = [
  {
    title: 'AI-Powered Generation',
    description: 'Create engaging captions using advanced AI technology tailored to your business niche.',
  },
  {
    title: 'Multiple Niches',
    description: 'Support for various business types including fitness, food, fashion, and more.',
  },
  {
    title: 'Save & Manage',
    description: 'Keep track of your generated captions and access them anytime.',
  },
  {
    title: 'Easy to Use',
    description: 'Simple interface that makes caption generation quick and effortless.',
  },
];

export default function HomePage() {
  const { session } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <Heading variant="h1" className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-6">
                  Caption Genius
                </Heading>
                <Text className="text-foreground/60 text-xl mb-8">
                  Create engaging social media captions for your business with AI
                </Text>
                <div className="flex justify-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg"
                  >
                    <Link href={session ? '/caption' : '/login'}>
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <Container>
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center mb-12"
              >
                <Heading variant="h2" className="text-3xl font-bold text-foreground mb-4">
                  Why Choose Caption Genius?
                </Heading>
                <Text className="text-foreground/60">
                  Everything you need to create engaging social media content
                </Text>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {FEATURES.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <Heading variant="h3" className="text-xl font-semibold text-foreground mb-2">
                          {feature.title}
                        </Heading>
                        <Text className="text-foreground/60">
                          {feature.description}
                        </Text>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-200/50 shadow-sm"
              >
                <Heading variant="h2" className="text-3xl font-bold text-foreground mb-4">
                  Ready to Transform Your Social Media?
                </Heading>
                <Text className="text-foreground/60 text-lg mb-8">
                  Start creating engaging captions that connect with your audience
                </Text>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg"
                >
                  <Link href={session ? '/caption' : '/login'}>
                    Get Started Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
} 