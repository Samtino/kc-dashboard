'use server';

import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@prisma/client';
import { createUser, createUserCookie, getUserData, updateUser } from './user';

type tokenData = {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

type guildData = {
  avatar: string;
  joined_at: string;
  nick: string;
  roles: string[];
  user: {
    id: string;
    username: string;
    avatar: string | null;
    global_name: string | null;
  };
};

const USER_ROLES_CACHE_KEY = 'user_roles_';

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

  if (!tokenResponse.ok) {
    throw new Error('Failed to retrieve access token from Discord');
  }

  const tokenData: tokenData = await tokenResponse.json();

  const guildResponse = await fetch(
    `https://discord.com/api/users/@me/guilds/${process.env.GUILD_ID}/member`,
    {
      headers: {
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    }
  );

  if (!guildResponse.ok) {
    throw new Error('Failed to retrieve guild data from Discord');
  }

  const guildResponseData: guildData = await guildResponse.json();

  const discordName =
    guildResponseData.nick || guildResponseData.user.global_name || guildResponseData.user.username;
  const discordAvatar = guildResponseData.avatar || guildResponseData.user.avatar || undefined;
  const avatarUrl = discordAvatar
    ? `https://cdn.discordapp.com/avatars/${guildResponseData.user.id}/${discordAvatar}.png`
    : undefined;

  const roles = await checkUserRoles(guildResponseData);

  const responseData: {
    discord_id: User['discord_id'];
    discord_username: User['discord_username'];
    discord_avatar_url: User['discord_avatar_url'] | undefined;
    roles: User['roles'];
  } = {
    discord_id: guildResponseData.user.id,
    discord_username: discordName,
    discord_avatar_url: avatarUrl,
    roles,
  };

  let user;
  try {
    user = await getUserData(responseData.discord_id as string);
  } catch (error) {
    user = await createUser(responseData);
  }

  // Update user only if necessary
  if (
    user.user.discord_username !== responseData.discord_username ||
    user.user.discord_avatar_url !== responseData.discord_avatar_url ||
    JSON.stringify(user.user.roles.sort()) !== JSON.stringify(responseData.roles.sort())
  ) {
    await updateUser(user.id, {
      discord_username: responseData.discord_username,
      discord_avatar_url: responseData.discord_avatar_url,
      roles: responseData.roles,
    });
  }

  await createUserCookie(user);

  return redirect('/dashboard');
};

const checkUserRoles = async (guildResponseData: guildData): Promise<User['roles']> => {
  const cacheKey = `${USER_ROLES_CACHE_KEY}${guildResponseData.user.id}`;
  let userRoles: User['roles'] = (await kv.get(cacheKey)) || [];

  if (!userRoles.length) {
    const rolesIds = guildResponseData.roles;
    userRoles = [];

    const sysAdmins = process.env.SYS_ADMIN_IDS?.split(',') ?? [];
    if (sysAdmins.includes(guildResponseData.user.id)) {
      userRoles.push('SYS_ADMIN');
    }

    rolesIds.forEach((roleId) => {
      switch (roleId) {
        case process.env.CS_ROLE_ID:
          userRoles.push('COMMUNITY_STAFF');
          break;
        case process.env.ADMIN_ROLE_ID:
          userRoles.push('ADMIN');
          break;
        case process.env.KOG_ROLE_ID:
        case process.env.MPU_ROLE_ID:
          userRoles.push('KOG');
          break;
        case process.env.KT_ROLE_ID:
          userRoles.push('KT');
          break;
      }
    });

    await kv.set(cacheKey, userRoles);
  }

  return userRoles;
};
