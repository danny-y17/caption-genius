import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    // Fetch recent captions with niche information
    const { data: captions, error } = await supabase
      .from('captions')
      .select(`
        id,
        generated_caption,
        created_at,
        niches (
          name
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

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
      text: caption.generated_caption,
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
    console.error('Error in recent-captions route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 