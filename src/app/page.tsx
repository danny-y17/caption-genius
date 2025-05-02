'use client';

import { useState } from 'react';
import { CaptionForm } from '@/features/captions/CaptionForm';
import { CaptionList } from '@/features/captions/CaptionList';

export default function HomePage() {
  const [captions, setCaptions] = useState<string[]>([]);

  const handleNewCaption = (caption: string) => {
    setCaptions([caption, ...captions]);
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Caption Generator</h1>
      <CaptionForm onCaptionGenerated={handleNewCaption} />
      <CaptionList captions={captions} />
    </main>
  );
}
