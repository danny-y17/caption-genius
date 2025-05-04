'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Download } from 'lucide-react';
import Header from '@/components/Header';

// Mock data - replace with actual API calls
const mockHistory = [
  {
    id: 1,
    date: '2024-03-20',
    caption: '✨ Elevate your brand with our premium products. Experience luxury redefined. #LuxuryLiving #PremiumQuality',
    platform: 'Instagram',
    likes: 245,
    engagement: '4.2%'
  },
  {
    id: 2,
    date: '2024-03-19',
    caption: '🌱 Sustainable living starts with small choices. Join us in making a difference, one step at a time. #EcoFriendly #SustainableLiving',
    platform: 'Twitter',
    likes: 189,
    engagement: '3.8%'
  },
  {
    id: 3,
    date: '2024-03-18',
    caption: '🎯 Your success is our priority. Let us help you reach new heights in your business journey. #BusinessGrowth #SuccessMindset',
    platform: 'LinkedIn',
    likes: 312,
    engagement: '5.1%'
  }
];

export default function HistoryPage() {
  const [history, setHistory] = useState(mockHistory);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = (id: number) => {
    setHistory(history.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
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
                            {item.platform}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-foreground/60">Likes: {item.likes}</span>
                          <span className="text-sm text-foreground/60">Engagement: {item.engagement}</span>
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
                    <Text className="text-foreground/80">{item.caption}</Text>
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