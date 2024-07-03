'use server';

import { kv } from '@vercel/kv';
import type { Permission } from '@prisma/client';
import prisma from '@/lib/prisma';
import { PermissionData } from '@/lib/types';

const PERMISSION_CACHE_KEY = 'permissions_cache';

export const getPermissionData = async (): Promise<PermissionData[]> => {
  let permissionCache: PermissionData[] | null = await kv.get(PERMISSION_CACHE_KEY);

  if (!permissionCache) {
    try {
      const permissions = await prisma.permission.findMany({
        include: {
          questions: true,
          prerequisites: true,
          prerequisite_for: true,
        },
      });

      permissionCache = permissions.map((permission) => ({
        id: permission.id,
        permission,
        questions: permission.questions,
        prerequisites: permission.prerequisites,
        prerequisitesFor: permission.prerequisite_for,
      }));

      await kv.set(PERMISSION_CACHE_KEY, permissionCache);
    } catch (error) {
      throw new Error('Failed to fetch permissions data');
    }
  }
  return permissionCache;
};

export const getPermissionDataById = async (id: Permission['id']): Promise<PermissionData> => {
  const permissionCache = await getPermissionData();

  const permission = permissionCache?.find((perm) => perm.id === id);

  if (!permission) {
    throw new Error('Permission not found');
  }

  return permission;
};

export const clearPermissionCache = async () => {
  await kv.del(PERMISSION_CACHE_KEY);
};
