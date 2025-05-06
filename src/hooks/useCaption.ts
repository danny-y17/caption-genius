import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/Providers';
import { toast } from 'react-hot-toast';

export function useCaption() {
  const { session } = useSupabase();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState('');

  const generateCaption = async (input: string, niche: string) => {
    if (!session?.access_token) {
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
        credentials: 'include',
        body: JSON.stringify({ input, niche }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate caption');
      }

      const data = await response.json();
      setGeneratedCaption(data.caption);
      toast.success('Caption generated successfully!');
    } catch (error) {
      console.error('Error generating caption:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate caption');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(generatedCaption);
      toast.success('Caption copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy caption');
    }
  };

  return {
    isGenerating,
    generatedCaption,
    generateCaption,
    copyCaption
  };
} 