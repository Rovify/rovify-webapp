import { NextRequest, NextResponse } from 'next/server';
import { supabase, handleSupabaseError } from '@/lib/supabase';

// GET /api/users - Get users with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const role = searchParams.get('role'); // 'organiser', 'admin', etc.
    const verified = searchParams.get('verified');

    let query = supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        image,
        bio,
        username,
        verified,
        is_organiser,
        is_admin,
        followers_count,
        following_count,
        interests,
        twitter,
        instagram,
        website,
        created_at
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (role === 'organiser') {
      query = query.eq('is_organiser', true);
    } else if (role === 'admin') {
      query = query.eq('is_admin', true);
    }

    if (verified) {
      query = query.eq('verified', verified === 'true');
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%, email.ilike.%${search}%, username.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      handleSupabaseError(error);
    }

    return NextResponse.json({
      users: data,
      total: count,
      limit,
      offset,
    });

  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
