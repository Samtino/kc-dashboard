'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createUser, createUserCookie, getUserData, updateUser } from './user';

export const login = async () => {
  const userCookie = cookies().get('user');

  if (userCookie) {
    return redirect('/dashboard');
  }

  return discordLogin();
};

export const logout = async () => {
  const userCookie = cookies().get('user');

  if (!userCookie) {
    return redirect('/');
  }

  cookies().delete('user');

  return redirect('/');
};

const discordLogin = async () => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI as string);
  const scopes = ['identify', 'guilds.members.read'];

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes.join('+')}`;

  return redirect(discordAuthUrl);
};

export const discordCallback = async (code: string) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  const params = new URLSearchParams();
  params.append('client_id', clientId || '');
  params.append('client_secret', clientSecret || '');
  params.append('code', code);
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', redirectUri || '');

  const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return redirect('/?error=TokenExchangeFailed');
  }

  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const userResponseData = await userResponse.json();

  if (!userResponseData.id) {
    return redirect('/?error=userDataFailed');
  }

  const responseData = {
    discord_id: userResponseData.id,
    discord_username: userResponseData.username,
    discord_avatar_url: `https://cdn.discordapp.com/avatars/${userResponseData.id}/${userResponseData.avatar}.png`,
  };

  let user;
  try {
    user = await getUserData(userResponseData.id);
  } catch (error) {
    user = await createUser(responseData);
  }

  if (
    user.user.discord_username !== responseData.discord_username ||
    user.user.discord_avatar_url !== responseData.discord_avatar_url
  ) {
    await updateUser(user.id, responseData);
  }

  await createUserCookie(user);

  return user;
};
