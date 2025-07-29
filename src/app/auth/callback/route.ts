import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    // Create a new supabase client for the callback
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Always redirect to dashboard after successful OAuth
      const dashboardUrl = new URL('/dashboard', origin);
      return NextResponse.redirect(dashboardUrl.toString());
    }
  }

  // Fallback - redirect to login
  const loginUrl = new URL('/login', origin);
  return NextResponse.redirect(loginUrl.toString());
}