import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Niche {
  id: string;
  name: string;
  description?: string;
}

export function useNiches() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNiches();
  }, []);

  const fetchNiches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/get-niches');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch niches');
      }

      setNiches(data.niches);
    } catch (error) {
      console.error('Error fetching niches:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch niches');
      toast.error('Failed to load niches');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    niches,
    isLoading,
    error,
    refetch: fetchNiches,
  };
} 