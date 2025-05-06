import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all voice presets
    const { data: presets, error: presetsError } = await supabase
      .from('voice_presets')
      .select('*');

    if (presetsError) throw presetsError;

    // Get user's voice preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_voice_preferences')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (preferencesError && preferencesError.code !== 'PGRST116') throw preferencesError;

    return NextResponse.json({
      presets,
      preferences: preferences || null
    });
  } catch (error) {
    console.error('Error fetching voice preferences:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
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
    const { presetId, customTone, samplePosts, nicheVocabulary } = body;

    // Upsert user voice preferences
    const { data, error } = await supabase
      .from('user_voice_preferences')
      .upsert({
        user_id: session.user.id,
        preset_id: presetId,
        custom_tone: customTone,
        sample_posts: samplePosts,
        niche_vocabulary: nicheVocabulary,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating voice preferences:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 