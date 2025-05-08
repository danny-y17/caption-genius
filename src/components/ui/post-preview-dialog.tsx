'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Edit, Trash2, Clock, Share2 } from 'lucide-react';
import { format } from 'date-fns';

interface PostPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    id: string;
    caption: string;
    niche: string;
    scheduledTime: string;
    platform: string;
    contentType: string;
    status: string;
  } | null;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export function PostPreviewDialog({
  open,
  onOpenChange,
  post,
  onEdit,
  onDelete,
}: PostPreviewDialogProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Post Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <Text className="font-medium">Caption</Text>
            <Text className="mt-2">{post.caption}</Text>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text className="font-medium text-sm text-foreground/60">Niche</Text>
              <Text className="mt-1">{post.niche}</Text>
            </div>
            <div>
              <Text className="font-medium text-sm text-foreground/60">Platform</Text>
              <Text className="mt-1 capitalize">{post.platform}</Text>
            </div>
            <div>
              <Text className="font-medium text-sm text-foreground/60">Content Type</Text>
              <Text className="mt-1 capitalize">{post.contentType}</Text>
            </div>
            <div>
              <Text className="font-medium text-sm text-foreground/60">Status</Text>
              <Text className="mt-1 capitalize">{post.status}</Text>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <Clock className="w-4 h-4" />
            <Text>
              Scheduled for {format(new Date(post.scheduledTime), 'MMM d, yyyy h:mm a')}
            </Text>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(post.id)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(post.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 