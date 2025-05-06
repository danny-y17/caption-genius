import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all captions with niche information
    const { data: captions, error } = await supabase
      .from('captions')
      .select(`
        id,
        generated_caption,
        created_at,
        prompt,
        niches (
          name
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching captions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch captions' },
        { status: 500 }
      );
    }

    // Format the response
    const formattedCaptions = captions.map(caption => ({
      id: caption.id,
      caption: caption.generated_caption,
      prompt: caption.prompt,
      niche: caption.niches.name,
      date: new Date(caption.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    return NextResponse.json({ captions: formattedCaptions });
  } catch (error) {
    console.error('Error in captions route:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { prompt, nicheId } = body;

    // Get user's voice preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_voice_preferences')
      .select(`
        *,
        voice_presets (
          name,
          tone_instructions
        )
      `)
      .eq('user_id', session.user.id)
      .single();

    if (preferencesError && preferencesError.code !== 'PGRST116') {
      throw preferencesError;
    }

    // Get niche information
    const { data: niche, error: nicheError } = await supabase
      .from('niches')
      .select('*')
      .eq('id', nicheId)
      .single();

    if (nicheError) throw nicheError;

    // Prepare system message with voice preferences
    let systemMessage = `You are a social media caption generator for ${niche.name}. `;
    
    if (preferences) {
      if (preferences.voice_presets) {
        systemMessage += `Use a ${preferences.voice_presets.name} tone: ${preferences.voice_presets.tone_instructions}. `;
      }
      
      if (preferences.custom_tone) {
        systemMessage += `Additional tone instructions: ${preferences.custom_tone}. `;
      }
      
      if (preferences.niche_vocabulary?.length > 0) {
        systemMessage += `Use these niche-specific terms: ${preferences.niche_vocabulary.join(', ')}. `;
      }
      
      if (preferences.sample_posts?.some(post => post.trim())) {
        systemMessage += `Here are some example posts to match the style: ${preferences.sample_posts.filter(Boolean).join(' | ')}. `;
      }
    }

    systemMessage += `Generate 3 unique captions that are engaging, authentic, and optimized for social media.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const captions = completion.choices[0].message.content
      ?.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, ''))
      .slice(0, 3) || [];

    // Save captions to database
    const { data: savedCaptions, error: saveError } = await supabase
      .from('captions')
      .insert(
        captions.map(caption => ({
          user_id: session.user.id,
          niche_id: nicheId,
          generated_caption: caption,
          prompt,
          voice_preset_id: preferences?.preset_id,
          custom_tone: preferences?.custom_tone,
          niche_vocabulary: preferences?.niche_vocabulary
        }))
      )
      .select();

    if (saveError) throw saveError;

    return NextResponse.json(savedCaptions);
  } catch (error) {
    console.error('Error generating captions:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 