'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <Container>
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">AI-Powered Caption Generation</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Heading variant="h1" align="center">
              Create Engaging Social Media
              <span className="text-primary"> Captions in Seconds</span>
            </Heading>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            <Text variant="lead" align="center">
              Transform your social media presence with AI-generated captions that capture attention, 
              increase engagement, and save you hours of writing time.
            </Text>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Button asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}; 