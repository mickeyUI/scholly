import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '../../lib/supabase';
import { SupabaseScholarship } from '../../Admin/types';

export async function POST(request: NextRequest) {
  try {
    const body: SupabaseScholarship = await request.json();
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured' },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from('scholarship_opportunities')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save scholarship' },
      { status: 500 }
    );
  }
}