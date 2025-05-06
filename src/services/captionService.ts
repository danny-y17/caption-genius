import { createClient } from '@supabase/supabase-js';
import { validateCaptionInput, validateSaveCaption, ValidationError } from '@/lib/validation/captionValidation';
import { supabase } from '@/lib/supabase';

export interface Caption {
  id: string;
  user_id: string;
  niche_id: string;
  prompt: string;
  generated_caption: string;
  is_favorite: boolean;
  usage_count: number;
  created_at: string;
  niches?: {
    id: string;
    name: string;
  };
}

export async function generateCaption(niche: string, input: string, userId: string) {
  try {
    validateCaptionInput({ niche, input, userId });

    const response = await fetch('/api/generate-caption', {
      method: 'POST',
      body: JSON.stringify({ niche, input }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate caption');
    }

    return response.json();
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new Error('Failed to generate caption');
  }
}

export async function getCaptionHistory(userId: string) {
  try {
    if (!userId) throw new ValidationError('User ID is required');
    
    console.log('Fetching captions for user:', userId);
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data, error } = await supabase
      .from('captions')
      .select(`
        id,
        generated_caption,
        created_at,
        prompt,
        is_favorite,
        usage_count,
        niches (
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST301') {
        throw new Error('JWT expired');
      }
      throw error;
    }

    console.log('Retrieved captions:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching caption history:', error);
    throw error;
  }
}

export async function deleteCaption(captionId: string, userId: string) {
  try {
    if (!captionId) throw new ValidationError('Caption ID is required');
    if (!userId) throw new ValidationError('User ID is required');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase
      .from('captions')
      .delete()
      .eq('id', captionId)
      .eq('user_id', userId);

    if (error) {
      if (error.code === 'PGRST301') {
        throw new Error('JWT expired');
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting caption:', error);
    throw error;
  }
}

export async function saveCaption(caption: Omit<Caption, 'id' | 'created_at'>, accessToken: string) {
  try {
    validateSaveCaption(caption);

    if (!accessToken) {
      throw new Error('No access token provided');
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase configuration is missing');
    }

    console.log('Creating authenticated Supabase client');
    console.log('Access token length:', accessToken.length);
    console.log('Access token first 10 chars:', accessToken.substring(0, 10) + '...');

    // Create a new authenticated client for this request
    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      }
    );

    console.log('Attempting to save caption:', {
      user_id: caption.user_id,
      niche_id: caption.niche_id,
      prompt: caption.prompt,
      generated_caption: caption.generated_caption
    });

    const { data, error } = await supabaseAuth
      .from('captions')
      .insert([caption])
      .select()
      .single();

    if (error) {
      const errorDetails = {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      };
      console.error('Supabase error details:', errorDetails);
      
      if (error.code === 'PGRST301') {
        throw new Error('JWT expired');
      }
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from save operation');
    }

    console.log('Caption saved successfully:', data);
    return data;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error in saveCaption:', errorMessage);
    if (errorStack) {
      console.error('Error stack:', errorStack);
    }
    throw new Error('Failed to save caption');
  }
}

export async function getNiches() {
  try {
    const { data, error } = await supabase
      .from('niches')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching niches:', error);
    throw new Error('Failed to fetch niches');
  }
}