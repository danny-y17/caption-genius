'use client';

import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { VoicePreferences } from '@/components/voice-preferences';

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-light py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Customize Your Experience</h1>
          <p className="text-foreground/60">Personalize how your captions are generated</p>
        </motion.div>

        <div className="space-y-6">
          {/* Voice Preferences */}
          <VoicePreferences />
        </div>
      </div>
    </div>
  );
} 