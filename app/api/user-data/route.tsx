import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/services/encryption';
import { User } from '@/app/lib/types';

export async function GET() {
  try {
    const encryptedData = cookies().get('user')?.value as string;
    const token = encryptedData.substring(1, encryptedData.length - 1);
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
