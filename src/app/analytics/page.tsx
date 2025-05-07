'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  LineChart, 
  TrendingUp, 
  Users, 
  Clock, 
  Hash, 
  Calendar,
  Download
} from 'lucide-react';
import Header from '@/components/layout/Header';

// Mock data - replace with actual API calls
const mockAnalytics = {
  overview: {
    totalCaptions: 1245,
    averageEngagement: 4.8,
    timeSaved: 32,
    activeUsers: 12
  },
  engagementTrends: [
    { month: 'Jan', engagement: 3.2 },
    { month: 'Feb', engagement: 4.1 },
    { month: 'Mar', engagement: 4.8 },
    { month: 'Apr', engagement: 5.2 }
  ],
  topPerformingCaptions: [
    {
      id: 1,
      caption: '✨ Transform your morning routine with our premium coffee blend...',
      engagement: 6.8,
      likes: 245,
      shares: 32
    },
    {
      id: 2,
      caption: '🧘‍♀️ Find your inner peace with our new yoga class series...',
      engagement: 5.9,
      likes: 189,
      shares: 28
    },
    {
      id: 3,
      caption: '💇‍♀️ Book your summer glow-up today! Limited slots available...',
      engagement: 5.2,
      likes: 156,
      shares: 24
    }
  ],
  popularHashtags: [
    { tag: '#LuxuryLiving', count: 245 },
    { tag: '#PremiumQuality', count: 189 },
    { tag: '#EcoFriendly', count: 156 },
    { tag: '#SustainableLiving', count: 132 }
  ]
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-8 bg-background/80 backdrop-blur-sm">
          <Container>
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <Heading variant="h1" className="text-3xl">Analytics Dashboard</Heading>
                    <Text className="text-foreground/60 mt-1">
                      Track and analyze your caption performance
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm rounded-lg p-1">
                      <Button
                        variant={timeRange === 'week' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setTimeRange('week')}
                      >
                        Week
                      </Button>
                      <Button
                        variant={timeRange === 'month' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setTimeRange('month')}
                      >
                        Month
                      </Button>
                      <Button
                        variant={timeRange === 'year' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setTimeRange('year')}
                      >
                        Year
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart className="w-5 h-5 text-primary" />
                    <Text className="text-foreground/60">Total Captions</Text>
                  </div>
                  <Text className="text-3xl font-bold">{mockAnalytics.overview.totalCaptions}</Text>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <Text className="text-foreground/60">Avg. Engagement</Text>
                  </div>
                  <Text className="text-3xl font-bold">{mockAnalytics.overview.averageEngagement}%</Text>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <Text className="text-foreground/60">Hours Saved</Text>
                  </div>
                  <Text className="text-3xl font-bold">{mockAnalytics.overview.timeSaved}h</Text>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-primary" />
                    <Text className="text-foreground/60">Active Users</Text>
                  </div>
                  <Text className="text-3xl font-bold">{mockAnalytics.overview.activeUsers}</Text>
                </motion.div>
              </div>

              {/* Engagement Trends */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <Text className="text-lg font-medium">Engagement Trends</Text>
                    <Text className="text-foreground/60">Performance over time</Text>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                  </Button>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <LineChart className="w-12 h-12 text-foreground/20" />
                </div>
              </motion.div>

              {/* Top Performing Captions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <Text className="text-lg font-medium">Top Performing Captions</Text>
                      <Text className="text-foreground/60">Highest engagement rates</Text>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {mockAnalytics.topPerformingCaptions.map((caption) => (
                      <div key={caption.id} className="bg-gray-50/50 rounded-lg p-4">
                        <Text className="text-foreground/80 mb-2">{caption.caption}</Text>
                        <div className="flex items-center gap-4 text-sm text-foreground/60">
                          <span>Engagement: {caption.engagement}%</span>
                          <span>Likes: {caption.likes}</span>
                          <span>Shares: {caption.shares}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Popular Hashtags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <Text className="text-lg font-medium">Popular Hashtags</Text>
                      <Text className="text-foreground/60">Most used tags</Text>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {mockAnalytics.popularHashtags.map((tag) => (
                      <div key={tag.tag} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-primary" />
                          <Text>{tag.tag}</Text>
                        </div>
                        <Text className="text-foreground/60">{tag.count} uses</Text>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
} 