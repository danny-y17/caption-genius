import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: niches, error } = await supabase
      .from('niches')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching niches:', error);
      return NextResponse.json(
        { error: 'Failed to fetch niches' },
        { status: 500 }
      );
    }

    return NextResponse.json({ niches });
  } catch (error) {
    console.error('Error in get-niches route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 