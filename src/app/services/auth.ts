'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(): Promise<void> {
  console.log('Login button pressed!');

  if (await cookies().has('user')) {
    console.log('User already logged in, redirecting to dashboard');
    return redirect('/dashboard');
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI as string);
  const scopes = ['identify', 'guilds.members.read'];

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes.join('+')}`;

  return redirect(discordAuthUrl);
}
