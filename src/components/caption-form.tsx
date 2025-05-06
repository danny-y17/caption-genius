'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function CaptionForm() {
  const { supabaseSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabaseSession?.user) {
      setError('You must be logged in to generate captions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-caption', {
        body: { prompt: caption }
      });

      if (error) throw error;

      // Handle successful caption generation
      console.log('Generated caption:', data);
    } catch (error) {
      console.error('Error generating caption:', error);
      setError('Failed to generate caption. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
          Enter your prompt
        </label>
        <textarea
          id="caption"
          name="caption"
          rows={4}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Describe what you want to caption..."
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Caption'}
      </button>
    </form>
  );
} 