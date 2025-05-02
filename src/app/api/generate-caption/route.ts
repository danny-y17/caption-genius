// src/app/api/generate-caption/route.ts

import { openai } from '@/services/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt, niche } = await req.json();

  const systemPrompt = `You are a creative copywriter for ${niche}. Write a compelling, fun, and engaging Instagram caption for: "${prompt}"`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 200,
  });

  const caption = response.choices[0].message.content;
  return NextResponse.json({ caption });
}
