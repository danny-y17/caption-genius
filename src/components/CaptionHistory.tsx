'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Caption {
  id: string;
  caption: string;
  prompt: string;
  niche: string;
  date: string;
}

interface CaptionHistoryProps {
  onSessionExpired: () => void;
}

export default function CaptionHistory({ onSessionExpired }: CaptionHistoryProps) {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaptions();
  }, []);

  const fetchCaptions = async () => {
    try {
      const response = await fetch('/api/captions');
      
      // Check for session expiration
      if (response.headers.get('X-Session-Expired') === 'true') {
        onSessionExpired();
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        if (data.error === 'SESSION_EXPIRED') {
          onSessionExpired();
          return;
        }
        throw new Error('Failed to fetch captions');
      }

      const data = await response.json();
      setCaptions(data.captions);
    } catch (error) {
      console.error('Error fetching captions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recent Captions</h2>
      {loading ? (
        <div>Loading captions...</div>
      ) : captions.length > 0 ? (
        captions.map((caption) => (
          <Card key={caption.id} className="bg-transparent border border-gray-200/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">
                {caption.niche} • {caption.date}
              </p>
              <p className="mb-2">{caption.caption}</p>
              <p className="text-sm text-muted-foreground">
                Prompt: {caption.prompt}
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No captions generated yet</p>
      )}
    </div>
  );
} 