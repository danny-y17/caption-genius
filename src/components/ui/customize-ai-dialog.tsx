'use client';

import { useState, useEffect } from 'react';
import { Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { Textarea } from './textarea';
import { Label } from './label';
import { Input } from './input';
import { useSupabase } from '@/app/providers/Providers';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

interface CustomizeAIDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomizeAIDialog({ isOpen, onClose }: CustomizeAIDialogProps) {
  const { session } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    purpose: '',
    tone: '',
    preferences: '',
    additionalTraits: ''
  });

  useEffect(() => {
    const fetchAiConfig = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
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
            additionalTraits: data.additional_traits || ''
          });
        }
      } catch (error) {
        console.error('Error fetching AI configuration:', error);
        toast.error('Failed to load AI configuration');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchAiConfig();
    }
  }, [session?.user?.id, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setSaving(true);
    try {
      // Deactivate all existing configurations
      await supabase
        .from('ai_configurations')
        .update({ is_active: false })
        .eq('user_id', session.user.id)
        .eq('is_active', true);

      // Insert new configuration
      const { error } = await supabase
        .from('ai_configurations')
        .insert({
          user_id: session.user.id,
          purpose: aiConfig.purpose,
          tone: aiConfig.tone,
          preferences: aiConfig.preferences,
          additional_traits: aiConfig.additionalTraits,
          is_active: true
        });

      if (error) throw error;

      toast.success('AI configuration saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving AI configuration:', error);
      toast.error('Failed to save AI configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-[90%] max-w-2xl rounded-lg bg-background p-4 sm:p-6 shadow-lg border border-gray-200/20 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-background pb-4 border-b border-gray-200/20">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Customize Your AI Assistant</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="purpose">What should your AI assistant do?</Label>
                    <div className="mt-2">
                      <Textarea
                        id="purpose"
                        placeholder="Describe the main purpose and tasks of your AI assistant..."
                        value={aiConfig.purpose}
                        onChange={(e) => setAiConfig({ ...aiConfig, purpose: e.target.value })}
                        className="min-h-[100px] resize-none w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tone">Tone and Communication Style</Label>
                    <div className="mt-2">
                      <Input
                        id="tone"
                        placeholder="e.g., Professional, Friendly, Humorous, etc."
                        value={aiConfig.tone}
                        onChange={(e) => setAiConfig({ ...aiConfig, tone: e.target.value })}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="preferences">AI Preferences and Guidelines</Label>
                    <div className="mt-2">
                      <Textarea
                        id="preferences"
                        placeholder="Specify any preferences, restrictions, or guidelines for the AI..."
                        value={aiConfig.preferences}
                        onChange={(e) => setAiConfig({ ...aiConfig, preferences: e.target.value })}
                        className="min-h-[100px] resize-none w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="additionalTraits">Additional Traits or Characteristics</Label>
                    <div className="mt-2">
                      <Textarea
                        id="additionalTraits"
                        placeholder="Any other specific traits or characteristics you want your AI to have..."
                        value={aiConfig.additionalTraits}
                        onChange={(e) => setAiConfig({ ...aiConfig, additionalTraits: e.target.value })}
                        className="min-h-[100px] resize-none w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 sticky bottom-0 bg-background pt-4 border-t border-gray-200/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 