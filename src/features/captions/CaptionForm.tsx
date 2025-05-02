// src/features/caption/CaptionForm.tsx
'use client';

import { useState } from 'react';

export function CaptionForm({ onCaptionGenerated }: { onCaptionGenerated: (caption: string) => void }) {
  const [prompt, setPrompt] = useState('');
  const [niche, setNiche] = useState('Yoga Studio');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const res = await fetch('/api/generate-caption', {
      method: 'POST',
      body: JSON.stringify({ prompt, niche }),
    });
    const data = await res.json();
    onCaptionGenerated(data.caption);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <textarea
        placeholder="Describe your post..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <select value={niche} onChange={(e) => setNiche(e.target.value)} className="border p-2 rounded">
        <option>Yoga Studio</option>
        <option>Indie Coffee Shop</option>
        <option>Fitness Trainer</option>
        {/* Add more niches here */}
      </select>
      <button
        onClick={generate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Generating...' : 'Generate Caption'}
      </button>
    </div>
  );
}
