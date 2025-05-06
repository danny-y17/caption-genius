'use client';

import { useAuth } from '@/features/caption/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface VoicePreset {
  id: string;
  name: string;
  description: string;
  tone_instructions: string;
}

interface VoicePreferences {
  voiceId: string;
  stability: number;
  similarity: number;
}

export function VoicePreferences() {
  const { supabaseSession } = useAuth();
  const [presets, setPresets] = useState<VoicePreset[]>([]);
  const [preferences, setPreferences] = useState<VoicePreferences>({
    voiceId: 'default',
    stability: 0.5,
    similarity: 0.5,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!supabaseSession?.user) return;

      try {
        const { data, error } = await supabase
          .from('voice_preferences')
          .select('*')
          .eq('user_id', supabaseSession.user.id)
          .single();

        if (error) throw error;

        if (data) {
          setPreferences(data);
        }
      } catch (error) {
        console.error('Error fetching voice preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [supabaseSession]);

  const handleSave = async () => {
    if (!supabaseSession?.user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('voice_preferences')
        .upsert({
          user_id: supabaseSession.user.id,
          ...preferences,
        });

      if (error) throw error;
      
      toast.success('Voice preferences saved successfully');
    } catch (error) {
      console.error('Error saving voice preferences:', error);
      toast.error('Failed to save voice preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Preferences</CardTitle>
        <CardDescription>
          Customize how your captions sound to match your brand voice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label>Choose your tone</Label>
          <RadioGroup
            value={preferences.voiceId}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, voiceId: value }))}
            className="grid grid-cols-2 gap-4"
          >
            {presets.map((preset) => (
              <div key={preset.id} className="flex items-center space-x-2">
                <RadioGroupItem value={preset.id} id={preset.id} />
                <Label htmlFor={preset.id} className="flex flex-col">
                  <span className="font-medium">{preset.name}</span>
                  <span className="text-sm text-muted-foreground">{preset.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="p-6 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-medium text-foreground mb-3">Brand Voice Example:</h3>
            <p className="text-sm text-foreground/80 italic leading-relaxed">
              &ldquo;Calm, empowering, spiritual, slightly poetic, no slang. Uses soft language and occasional Sanskrit words like &lsquo;prana&rsquo; and &lsquo;namaste&rsquo;.&rdquo;
            </p>
          </div>

          <div className="space-y-2">
            <Label>Stability</Label>
            <input
              type="range"
              id="stability"
              min="0"
              max="1"
              step="0.1"
              value={preferences.stability}
              onChange={(e) => setPreferences({ ...preferences, stability: parseFloat(e.target.value) })}
              className="mt-1 block w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Similarity</Label>
            <input
              type="range"
              id="similarity"
              min="0"
              max="1"
              step="0.1"
              value={preferences.similarity}
              onChange={(e) => setPreferences({ ...preferences, similarity: parseFloat(e.target.value) })}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
} 