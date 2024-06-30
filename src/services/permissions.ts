'use server';

import prisma from '@/lib/prisma';
import { PermissionData } from '@/lib/types';

let permissionCache: PermissionData[] | null = null;

export const getPermissionData = async (): Promise<PermissionData[]> => {
  if (!permissionCache) {
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
  }
  return permissionCache;
};

export const clearPermissionCache = async () => {
  permissionCache = null;
};
