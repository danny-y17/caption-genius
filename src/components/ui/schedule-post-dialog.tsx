'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Caption {
  id: string;
  generated_caption: string;
  niches: {
    name: string;
  }[];
}

interface ScheduledPost {
  id: string;
  caption_id: string;
  scheduled_time: string;
  platform: string;
  content_type: string;
  caption: {
    generated_caption: string;
    niches: {
      name: string;
    }[];
  };
}

interface SchedulePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editingPost?: ScheduledPost | null;
}

export function SchedulePostDialog({ 
  open, 
  onOpenChange, 
  onSuccess,
  editingPost 
}: SchedulePostDialogProps) {
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [selectedCaption, setSelectedCaption] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [platform, setPlatform] = useState<string>('instagram');
  const [contentType, setContentType] = useState<string>('promotional');

  useEffect(() => {
    if (open) {
      fetchRecentCaptions();
      if (editingPost) {
        setSelectedCaption(editingPost.caption_id);
        setScheduledTime(new Date(editingPost.scheduled_time).toISOString().slice(0, 16));
        setPlatform(editingPost.platform);
        setContentType(editingPost.content_type);
      } else {
        // Reset form when opening for new post
        setSelectedCaption('');
        setScheduledTime('');
        setPlatform('instagram');
        setContentType('promotional');
      }
    }
  }, [open, editingPost]);

  const fetchRecentCaptions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('captions')
        .select(`
          id,
          generated_caption,
          niches (
            name
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setCaptions(data || []);
    } catch (error) {
      console.error('Error fetching captions:', error);
      toast.error('Failed to load recent captions');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaption || !scheduledTime || !platform || !contentType) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('scheduled_posts')
          .update({
            caption_id: selectedCaption,
            scheduled_time: scheduledTime,
            platform,
            content_type: contentType,
          })
          .eq('id', editingPost.id);

        if (error) throw error;
        toast.success('Post updated successfully');
      } else {
        // Create new post
        const { error } = await supabase
          .from('scheduled_posts')
          .insert({
            user_id: session.user.id,
            caption_id: selectedCaption,
            scheduled_time: scheduledTime,
            platform,
            content_type: contentType,
          });

        if (error) throw error;
        toast.success('Post scheduled successfully');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast.error(editingPost ? 'Failed to update post' : 'Failed to schedule post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingPost ? 'Edit Post' : 'Schedule Post'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caption">Select Caption</Label>
            <Select value={selectedCaption} onValueChange={setSelectedCaption}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a caption" />
              </SelectTrigger>
              <SelectContent>
                {captions.map((caption) => (
                  <SelectItem key={caption.id} value={caption.id}>
                    <div className="flex flex-col">
                      <span className="line-clamp-1">{caption.generated_caption}</span>
                      <span className="text-xs text-foreground/60">{caption.niches?.[0]?.name || 'General'}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledTime">Scheduled Time</Label>
            <Input
              id="scheduledTime"
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promotional">Promotional</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="entertaining">Entertaining</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (editingPost ? 'Updating...' : 'Scheduling...') 
                : (editingPost ? 'Update Post' : 'Schedule Post')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
