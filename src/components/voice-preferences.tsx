'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/app/providers/Providers';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AIConfigForm {
  purpose: string;
  tone: string;
  preferences: string;
  additionalTraits: string;
}

export function VoicePreferences() {
  const { session } = useSupabase();
  const [aiConfig, setAiConfig] = useState<AIConfigForm>({
    purpose: '',
    tone: '',
    preferences: '',
    additionalTraits: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('ai_configurations')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          setAiConfig({
            purpose: data.purpose,
            tone: data.tone,
            preferences: data.preferences,
            additionalTraits: data.additional_traits || '',
          });
        }
      } catch (error) {
        console.error('Error fetching voice preferences:', error);
        toast.error('Failed to load AI preferences');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [session?.user?.id]);

  const handleSave = async () => {
    if (!session?.user?.id) return;

    setSaving(true);
    try {
      const { error: deactivateError } = await supabase
        .from('ai_configurations')
        .update({ is_active: false })
        .eq('user_id', session.user.id)
        .eq('is_active', true);

      if (deactivateError) throw deactivateError;

      const { error } = await supabase
        .from('ai_configurations')
        .insert({
          user_id: session.user.id,
          purpose: aiConfig.purpose,
          tone: aiConfig.tone,
          preferences: aiConfig.preferences,
          additional_traits: aiConfig.additionalTraits,
          is_active: true,
        });

      if (error) throw error;
      
      toast.success('AI preferences saved successfully');
    } catch (error) {
      console.error('Error saving voice preferences:', error);
      toast.error('Failed to save AI preferences');
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
        <CardTitle>AI Preferences</CardTitle>
        <CardDescription>
          Customize how your captions are generated to match your brand voice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="purpose">Primary Goal</Label>
          <Textarea
            id="purpose"
            placeholder="Describe the goal for your generated captions..."
            value={aiConfig.purpose}
            onChange={(e) => setAiConfig({ ...aiConfig, purpose: e.target.value })}
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="tone">Tone</Label>
          <Input
            id="tone"
            placeholder="e.g. Professional, warm, energetic"
            value={aiConfig.tone}
            onChange={(e) => setAiConfig({ ...aiConfig, tone: e.target.value })}
            required
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="preferences">Guidelines</Label>
          <Textarea
            id="preferences"
            placeholder="Rules and preferences to follow in each caption..."
            value={aiConfig.preferences}
            onChange={(e) => setAiConfig({ ...aiConfig, preferences: e.target.value })}
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="traits">Additional Traits (Optional)</Label>
          <Textarea
            id="traits"
            placeholder="Any additional characteristics for your assistant..."
            value={aiConfig.additionalTraits}
            onChange={(e) => setAiConfig({ ...aiConfig, additionalTraits: e.target.value })}
            className="min-h-[100px]"
          />
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
