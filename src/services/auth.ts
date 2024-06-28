'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(): Promise<void> {
  if (await cookies().has('user')) {
    return redirect('/dashboard');
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI as string);
  const scopes = ['identify', 'guilds.members.read'];

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes.join('+')}`;

  return redirect(discordAuthUrl);
}

export async function logout(): Promise<void> {
  // 'use client';

  const userCookie = cookies().get('user');

  if (!userCookie) {
    return redirect('/');
  }

  cookies().delete('user');

  return redirect('/');
}
