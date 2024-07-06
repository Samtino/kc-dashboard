'use server';

import { cookies } from 'next/headers';
import type { User } from '@prisma/client';
import { kv } from '@vercel/kv';
import prisma from '@/lib/prisma';
import { UserData } from '@/lib/types';
import { decrypt, encrypt } from './encryption';

const USER_CACHE_KEY_PREFIX = 'user_cache_';

export const getUserData = async (discord_id: User['discord_id']): Promise<UserData> => {
  const cacheKey = `${USER_CACHE_KEY_PREFIX}${discord_id}`;
  let userCache: UserData | null = await kv.get(cacheKey);

  if (!userCache) {
    const user = await prisma.user.findUnique({
      where: { discord_id },
      include: {
        permissions: true,
        applications: true,
        strikes: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    userCache = {
      id: user.id,
      user,
      permissions: user.permissions,
      applications: user.applications,
      strikes: user.strikes,
    };

    await kv.set(cacheKey, userCache);
  }

  return userCache;
};

export const getCurrentUser = async (): Promise<UserData> => {
  const cookie = cookies().get('user');

  if (!cookie) {
    throw new Error('User not found');
  }

  const userData = (await decrypt(cookie.value)) as UserData;

  return userData;
};

export const updateUserCookie = async (discord_id: User['discord_id']) => {
  const userData = await getUserData(discord_id);

  if (!userData) {
    throw new Error('User not found');
  }

  await createUserCookie(userData);

  return userData;
};

export const createUserCookie = async (user: UserData) => {
  try {
    const cookie = await encrypt(user);

    cookies().set('user', cookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    });
    return cookie;
  } catch (error) {
    throw new Error(`Failed to create user cookie: ${error}`);
  }
};

export const createUser = async ({
  discord_id,
  discord_username,
  discord_avatar_url,
}: {
  discord_id: User['discord_id'];
  discord_username: User['discord_username'];
  discord_avatar_url?: User['discord_avatar_url'];
}): Promise<UserData> => {
  const userData = await prisma.user.create({
    data: {
      discord_id,
      discord_username,
      discord_avatar_url,
    },
    include: {
      permissions: true,
      applications: true,
      strikes: true,
    },
  });

  const cacheKey = `${USER_CACHE_KEY_PREFIX}${userData.discord_id}`;
  await kv.set(cacheKey, userData);

  return {
    id: userData.id,
    user: userData,
    permissions: userData.permissions,
    applications: userData.applications,
    strikes: userData.strikes,
  };
};

export const updateUser = async (user_id: User['id'], data: Partial<User>) =>
  prisma.user.update({
    where: { id: user_id },
    data,
  });
