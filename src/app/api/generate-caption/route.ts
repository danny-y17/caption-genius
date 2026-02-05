// /app/api/generate-caption/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { openai } from '@/services/openai';
import {
  ValidationError,
  validateCaptionInput,
  validateSaveCaption,
} from '@/lib/validation/captionValidation';

const DAILY_CAPTION_LIMIT = Number(process.env.DAILY_CAPTION_LIMIT ?? '30');
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return NextResponse.json(
        { error: 'Session error - Please sign in again' },
        { status: 401 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in first' },
        { status: 401 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Caption generation service is not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const niche = typeof body.niche === 'string' ? body.niche.trim() : '';
    const input = typeof body.input === 'string' ? body.input.trim() : '';

    validateCaptionInput({ niche, input, userId: session.user.id });

    const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentUsageCount, error: usageCountError } = await supabase
      .from('usage_logs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .eq('action_type', 'caption_generation')
      .gte('created_at', windowStart);

    if (usageCountError) {
      return NextResponse.json(
        { error: 'Unable to validate current usage limits' },
        { status: 500 }
      );
    }

    if ((recentUsageCount || 0) >= DAILY_CAPTION_LIMIT) {
      return NextResponse.json(
        { error: `Daily caption limit reached (${DAILY_CAPTION_LIMIT}/24h)` },
        { status: 429 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_plan_id, credits_remaining')
      .eq('id', session.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Unable to verify account usage limits' },
        { status: 500 }
      );
    }

    if (profile?.subscription_plan_id && (profile.credits_remaining ?? 0) <= 0) {
      return NextResponse.json(
        { error: 'You have no remaining credits for this billing period' },
        { status: 402 }
      );
    }

    const { data: aiConfig, error: aiConfigError } = await supabase
      .from('ai_configurations')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single();

    if (aiConfigError && aiConfigError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to fetch AI configuration' },
        { status: 500 }
      );
    }

    let prompt = `Generate a creative and engaging social media caption for a ${niche} business. 
    Context: ${input}`;

    if (aiConfig) {
      prompt += `\n\nPlease follow these preferences:
      - Purpose: ${aiConfig.purpose}
      - Tone: ${aiConfig.tone}
      - Style: ${aiConfig.preferences}
      ${aiConfig.additional_traits ? `- Additional traits: ${aiConfig.additional_traits}` : ''}`;
    }

    prompt += '\nMake it authentic, engaging, and suitable for Instagram. Include relevant hashtags.';

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a creative social media copywriter who specializes in writing engaging captions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const generatedCaption = completion.choices[0]?.message?.content?.trim();

    if (!generatedCaption) {
      return NextResponse.json(
        { error: 'Failed to generate caption content' },
        { status: 500 }
      );
    }

    const { data: nicheData, error: nicheError } = await supabase
      .from('niches')
      .select('id')
      .eq('name', niche)
      .single();

    if (nicheError || !nicheData) {
      return NextResponse.json(
        { error: 'Invalid niche selected' },
        { status: 400 }
      );
    }

    const captionData = {
      user_id: session.user.id,
      niche_id: nicheData.id,
      prompt: input,
      generated_caption: generatedCaption,
    };

    validateSaveCaption(captionData);

    const { error: saveError } = await supabase
      .from('captions')
      .insert(captionData)
      .select('id')
      .single();

    if (saveError) {
      return NextResponse.json(
        { error: 'Failed to save caption' },
        { status: 500 }
      );
    }

    const { error: usageLogError } = await supabase
      .from('usage_logs')
      .insert({
        user_id: session.user.id,
        action_type: 'caption_generation',
        credits_used: 1,
        details: {
          niche,
          model: DEFAULT_MODEL,
        },
      });

    if (usageLogError) {
      console.error('Usage log error:', usageLogError.message);
    }

    if ((profile?.credits_remaining ?? 0) > 0) {
      const { error: creditUpdateError } = await supabase
        .from('profiles')
        .update({
          credits_remaining: (profile?.credits_remaining ?? 0) - 1,
        })
        .eq('id', session.user.id);

      if (creditUpdateError) {
        console.error('Credit update error:', creditUpdateError.message);
      }
    }

    return NextResponse.json({ caption: generatedCaption });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('401')) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401 }
      );
    }

    console.error('Caption generation error:', error);

    return NextResponse.json(
      { error: 'Failed to generate caption' },
      { status: 500 }
    );
  }
}
