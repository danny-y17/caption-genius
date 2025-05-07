// /app/api/generate-caption/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { openai } from '@/services/openai';

export async function POST(req: NextRequest) {
  try {
    // Get the session using Supabase with cookie handling
    const supabase = await createServerSupabaseClient();
    
    // Get the session from cookies
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Session error - Please sign in again' },
        { status: 401 }
      );
    }

    if (!session) {
      console.error('No session found in cookies');
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in first' },
        { status: 401 }
      );
    }

    // Log session details
    console.log('Session details:', {
      hasSession: !!session,
      userId: session.user.id,
      hasAccessToken: !!session.access_token
    });

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const { niche, input } = await req.json();

    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    const prompt = `Generate a creative and engaging social media caption for a ${niche} business. 
    Context: ${input}
    Make it authentic, engaging, and suitable for Instagram. Include relevant hashtags.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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

    const generatedCaption = completion.choices[0]?.message?.content || 'Failed to generate caption';

    // Get niche ID from the name
    const { data: nicheData, error: nicheError } = await supabase
      .from('niches')
      .select('id')
      .eq('name', niche)
      .single();

    if (nicheError) {
      console.error('Error fetching niche:', nicheError);
      return NextResponse.json(
        { error: 'Failed to save caption' },
        { status: 500 }
      );
    }

    console.log('Niche data:', nicheData);

    // Prepare the caption data
    const captionData = {
      user_id: session.user.id,
      niche_id: nicheData.id,
      prompt: input,
      generated_caption: generatedCaption,
    };

    console.log('Attempting to save caption with data:', captionData);

    // Save the caption to the database
    const { data: savedCaption, error: saveError } = await supabase
      .from('captions')
      .insert(captionData)
      .select()
      .single();

    if (saveError) {
      console.error('Error saving caption:', {
        error: saveError,
        errorCode: saveError.code,
        errorMessage: saveError.message,
        errorDetails: saveError.details,
        errorHint: saveError.hint
      });
      return NextResponse.json(
        { error: `Failed to save caption: ${saveError.message}` },
        { status: 500 }
      );
    }

    console.log('Successfully saved caption:', savedCaption);

    return NextResponse.json({ caption: generatedCaption });
  } catch (error) {
    console.error('Caption generation error:', error);
    // Check if it's an OpenAI API error
    if (error instanceof Error && error.message.includes('401')) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to generate caption' },
      { status: 500 }
    );
  }
}
