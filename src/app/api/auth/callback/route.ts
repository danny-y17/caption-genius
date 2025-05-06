import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/supabase/types'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  await supabase.auth.getSession()

  return NextResponse.redirect(new URL('/dashboard', req.url))
}