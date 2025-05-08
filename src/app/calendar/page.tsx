'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Plus, BarChart2, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { useSupabase } from '@/app/providers/Providers';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { SchedulePostDialog } from '@/components/ui/schedule-post-dialog';
import { PostPreviewDialog } from '@/components/ui/post-preview-dialog';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface ScheduledPost {
  id: string;
  caption_id: string;
  scheduled_time: string;
  platform: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  content_type: 'promotional' | 'educational' | 'entertaining' | 'engagement';
  caption: {
    generated_caption: string;
    niches: {
      name: string;
    };
  };
}

interface ContentMix {
  type: 'promotional' | 'educational' | 'entertaining' | 'engagement';
  count: number;
  percentage: number;
}

export default function CalendarPage() {
  const { session } = useSupabase();
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentMix, setContentMix] = useState<ContentMix[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchScheduledPosts();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchScheduledPosts = async () => {
    try {
      if (!session?.user?.id) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('scheduled_posts')
        .select(`
          *,
          caption:captions (
            generated_caption,
            niches (
              name
            )
          )
        `)
        .eq('user_id', session.user.id)
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      setScheduledPosts(data || []);
      calculateContentMix(data || []);
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
      toast.error('Failed to load scheduled posts');
    } finally {
      setLoading(false);
    }
  };

  const calculateContentMix = (posts: ScheduledPost[]) => {
    const mix: ContentMix[] = [
      { type: 'promotional', count: 0, percentage: 0 },
      { type: 'educational', count: 0, percentage: 0 },
      { type: 'entertaining', count: 0, percentage: 0 },
      { type: 'engagement', count: 0, percentage: 0 },
    ];

    posts.forEach(post => {
      const type = post.content_type;
      const index = mix.findIndex(m => m.type === type);
      if (index !== -1) {
        mix[index].count++;
      }
    });

    const total = mix.reduce((sum, item) => sum + item.count, 0);
    mix.forEach(item => {
      item.percentage = total > 0 ? (item.count / total) * 100 : 0;
    });

    setContentMix(mix);
  };

  const handleEventClick = (event: any) => {
    const post = event.resource as ScheduledPost;
    setSelectedPost(post);
    setShowPreview(true);
  };

  const handleEditPost = (postId: string) => {
    const post = scheduledPosts.find(p => p.id === postId);
    if (post) {
      setEditingPost(post);
      setShowScheduleForm(true);
      setShowPreview(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast.success('Post deleted successfully');
      fetchScheduledPosts();
      setShowPreview(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const getBestTimeToPost = () => {
    // This would be replaced with actual analytics data
    return {
      weekday: 'Wednesday',
      time: '3:00 PM',
      reason: 'Based on your audience engagement patterns'
    };
  };

  const calendarEvents = scheduledPosts.map(post => ({
    id: post.id,
    title: post.caption.generated_caption,
    start: new Date(post.scheduled_time),
    end: new Date(post.scheduled_time),
    resource: post,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
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
                  <Heading variant="h1" className="text-3xl">Content Calendar</Heading>
                  <Text className="text-foreground/60 mt-1">
                    Schedule and manage your social media posts
                  </Text>
                </div>
                <Button onClick={() => setShowScheduleForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Post
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar View */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <Text className="text-lg font-medium">Calendar</Text>
                </div>
                <div className="h-[600px]">
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    onSelectEvent={handleEventClick}
                    onSelectSlot={(slotInfo) => {
                      setSelectedDate(slotInfo.start);
                      setShowScheduleForm(true);
                    }}
                    selectable
                    popup
                    views={['month', 'week', 'day']}
                  />
                </div>
              </motion.div>

              {/* Best Time to Post */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <Text className="text-lg font-medium">Best Time to Post</Text>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <Text className="font-medium">{getBestTimeToPost().weekday}</Text>
                    <Text className="text-2xl font-bold mt-1">{getBestTimeToPost().time}</Text>
                    <Text className="text-sm text-foreground/60 mt-2">
                      {getBestTimeToPost().reason}
                    </Text>
                  </div>
                </div>
              </motion.div>

              {/* Content Mix */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <BarChart2 className="w-5 h-5 text-primary" />
                  <Text className="text-lg font-medium">Content Mix</Text>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {contentMix.map((mix) => (
                    <div key={mix.type} className="bg-gray-50 rounded-lg p-4">
                      <Text className="font-medium capitalize">{mix.type}</Text>
                      <Text className="text-2xl font-bold mt-1">{mix.percentage.toFixed(0)}%</Text>
                      <Text className="text-sm text-foreground/60 mt-2">
                        {mix.count} posts
                      </Text>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Posts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <Text className="text-lg font-medium">Upcoming Posts</Text>
                </div>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4">
                      <Text className="text-foreground/60">Loading...</Text>
                    </div>
                  ) : scheduledPosts.length > 0 ? (
                    scheduledPosts.slice(0, 5).map((post) => (
                      <div key={post.id} className="bg-gray-50 rounded-lg p-4">
                        <Text className="font-medium">
                          {new Date(post.scheduled_time).toLocaleDateString()}
                        </Text>
                        <Text className="text-sm text-foreground/80 mt-1 line-clamp-2">
                          {post.caption.generated_caption}
                        </Text>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                            {post.platform}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs capitalize">
                            {post.content_type}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Text className="text-foreground/60">No upcoming posts</Text>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Post Preview Dialog */}
          <PostPreviewDialog
            open={showPreview}
            onOpenChange={setShowPreview}
            post={selectedPost ? {
              id: selectedPost.id,
              caption: selectedPost.caption.generated_caption,
              niche: selectedPost.caption.niches.name,
              scheduledTime: selectedPost.scheduled_time,
              platform: selectedPost.platform,
              contentType: selectedPost.content_type,
              status: selectedPost.status
            } : null}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />

          {/* Schedule Post Dialog */}
          <SchedulePostDialog
            open={showScheduleForm}
            onOpenChange={(open) => {
              setShowScheduleForm(open);
              if (!open) setEditingPost(null);
            }}
            onSuccess={fetchScheduledPosts}
            editingPost={editingPost}
          />
        </Container>
      </main>
    </div>
  );
} 