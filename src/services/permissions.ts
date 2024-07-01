'use server';

import prisma from '@/lib/prisma';
import { PermissionData } from '@/lib/types';

let permissionCache: PermissionData[] | null = null;

export const getPermissionData = async (): Promise<PermissionData[]> => {
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
    } catch (error) {
      throw new Error('Failed to fetch permissions data');
    }
  }
  return permissionCache;
};

export const getPermissionDataById = async (id: string): Promise<PermissionData> => {
  if (!permissionCache) {
    await getPermissionData();
  }

  const permission = permissionCache?.find((perm) => perm.id === id);

  if (!permission) {
    throw new Error('Permission not found');
  }

  return permission;
};

export const clearPermissionCache = async () => {
  permissionCache = null;
};
