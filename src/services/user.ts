'use server';

import { cookies } from 'next/headers';
import { User } from '@prisma/client';
import { UserData } from '@/lib/types';
import prisma from '@/lib/prisma';
import { encrypt } from './encryption';

export const getUserData = async (userId: User['id']): Promise<UserData> => {
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      permissions: true,
      applications: true,
      strikes: true,
    },
  });

  if (!userData) {
    throw new Error('User not found');
  }

  return {
    id: userData.id,
    user: userData,
    permissions: userData.permissions,
    applications: userData.applications,
    strikes: userData.strikes,
  };
};

export const createUserCookie = async (user: UserData) => {
  const cookie = await encrypt(user);

  cookies().set('user', cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600, // 1 hour
    path: '/',
  });
};

export const createUser = async ({
  discord_id,
  discord_username,
  discord_avatar_url,
}: {
  discord_id: User['discord_id'];
  discord_username: User['discord_username'];
  discord_avatar_url: User['discord_avatar_url'];
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
