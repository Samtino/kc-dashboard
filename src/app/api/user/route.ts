import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

import User, { IUser } from '@/src/Model/User';
import connectDB from '@/src/app/lib/connectDB';

// TODO HIGH: Add authentication to the API routes (POST, PUT, DELETE)

export async function GET(req: NextApiRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url || '');
    const id = searchParams.get('id') || undefined;

    if (!id) {
      return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    const user = await User.findById(id);
    return NextResponse.json({ value: user, status: 200 });
  } catch (error: any) {
    console.error('Error in USER GET: ', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextApiRequest) {
  // TODO: Get user data from the request body and save it to the database
  try {
    await connectDB();

    // TODO: Replace this with the actual user data from the request body
    const user: IUser = new User({
      discord: {
        id: '1234567890',
        name: 'test',
        avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      },
      roles: {
        KOG: true,
        sysAdmin: true,
      },
    });

    await user.save();

    return NextResponse.json({ value: `Added new user with id: ${user._id}`, status: 200 });
  } catch (error: any) {
    console.error('Error in User POST: ', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextApiRequest) {
  // TODO: Get user data and id from the request and update given user in the database

  try {
    await connectDB();

    const { searchParams } = new URL(req.url || '');
    const id = searchParams.get('id') || undefined;

    if (!id) {
      return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.roles.sysAdmin = !user.roles.sysAdmin; // TODO: Remove this line and replace it with the actual update logic
    await user.save();

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error('Error in User PUT: ', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextApiRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url || '');
    const id = searchParams.get('id') || undefined;

    if (!id) {
      return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await user.delete();

    return NextResponse.json({ value: `User with id: ${id} has been deleted`, status: 200 });
  } catch (error: any) {
    console.error('Error in User DELETE: ', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
