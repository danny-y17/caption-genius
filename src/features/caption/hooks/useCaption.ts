import { useState } from 'react';

// logic for generating caption
export function useCaption() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState('');

  const generateCaption = async (input: string, niche: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, niche }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate caption');
      }

      const data = await response.json();
      setGeneratedCaption(data.caption);
    } catch (error) {
      console.error('Error generating caption:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCaption = async () => {
    if (generatedCaption) {
      await navigator.clipboard.writeText(generatedCaption);
    }
  };

  return {
    isGenerating,
    generatedCaption,
    generateCaption,
    copyCaption,
  };
} 