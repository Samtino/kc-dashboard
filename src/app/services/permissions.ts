'use server';

import type { Application, Permission, Strike, User, UserPermission } from '@prisma/client';
import prisma from '@/src/db';

export async function getPermissionsData(
  examType: 'standard' | 'asset_exam'
): Promise<Permission[]> {
  const stringToBooleanMap: Map<string, boolean> = new Map([
    ['standard', false],
    ['asset_exam', true],
  ]);
  const type = stringToBooleanMap.get(examType);

  try {
    const perms = await prisma.permission.findMany({
      where: {
        asset_exam: type,
      },
    });

    return perms;
  } catch (error) {
    return [];
  }
}

export async function getUserPermissions(user_id: User['id']): Promise<UserPermission[]> {
  try {
    const userPerms = await prisma.userPermission.findMany({
      where: {
        user_id,
      },
    });

    return userPerms;
  } catch (error) {
    return [];
  }
}

export async function getUserApplications(user_id: User['id']): Promise<Application[]> {
  try {
    const userApps = await prisma.application.findMany({
      where: {
        user_id,
      },
    });

    return userApps;
  } catch (error) {
    return [];
  }
}

export async function getUserStrikes(user_id: User['id']): Promise<Strike[]> {
  try {
    const strikes = await prisma.strike.findMany({
      where: {
        userId: user_id,
      },
    });

    return strikes;
  } catch (error) {
    return [];
  }
}
