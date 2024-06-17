import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { createUser, getUser } from '@/src/app/services/user';

export async function GET(req: NextApiRequest) {
  try {
    const { searchParams } = new URL(req.url || '');
    const id = searchParams.get('id') || undefined;

    if (!id) {
      return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    const user = await getUser(id);

    return NextResponse.json({ value: user, status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to get user data: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextApiRequest) {
  try {
    if (!req.body) {
      return NextResponse.json({ error: 'No body provided' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url || '');

    const discordID = searchParams.get('discordID');
    const discordName = searchParams.get('discordName');
    const discordAvatar = searchParams.get('discordAvatar') || undefined;

    if (!discordID || !discordName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = createUser(discordID, discordName, discordAvatar);

    if (!user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to create user: ${error.message}` }, { status: 500 });
  }
}
