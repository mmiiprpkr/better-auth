import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error('[Session API Error]', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 401 }
    );
  }
}