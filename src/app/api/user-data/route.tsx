import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/src/app/services/encryption';
import { User } from '@/lib/types';

export async function GET() {
  try {
    const key = process.env.SECRET;

    if (!key) {
      return NextResponse.json({ error: 'No key provided' }, { status: 400 });
    }

    const token = cookies().get('user')?.value as string;
    if (!token) {
      return NextResponse.json({ error: 'No user cookie found' }, { status: 404 });
    }

    const user: User = await decrypt(token);
    if (!user) {
      return NextResponse.json({ error: 'No user data found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to decrypt user data: ${error.message}` },
      { status: 500 }
    );
  }
}
