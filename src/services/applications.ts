'use server';

import { kv } from '@vercel/kv';
import { Application, Permission, User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ApplicationData } from '@/lib/types';

const APPLICATION_CACHE_KEY = 'application_cache';
const PENDING_APPLICATION_CACHE_KEY = 'pending_application_cache';

export const getApplicationData = async (): Promise<ApplicationData[]> => {
  let applicationCache: ApplicationData[] | null = await kv.get(APPLICATION_CACHE_KEY);

  if (!applicationCache) {
    const applications = await prisma.application.findMany({
      include: {
        user: true,
        permission: true,
        processed_by: true,
      },
    });

    applicationCache = applications.map((application) => ({
      id: application.id,
      application,
      user: application.user,
      permission: application.permission,
      answers: application.answers,
      status: application.status,
      processed_by: application.processed_by,
    }));

    await kv.set(APPLICATION_CACHE_KEY, applicationCache);
  }

  return applicationCache;
};

export const getPendingApplications = async (): Promise<ApplicationData[]> => {
  let pendingAppCache: ApplicationData[] | null = await kv.get(PENDING_APPLICATION_CACHE_KEY);

  if (!pendingAppCache) {
    const applications = await prisma.application.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        user: true,
        permission: true,
        processed_by: true,
      },
    });

    pendingAppCache = applications.map((application) => ({
      id: application.id,
      application,
      user: application.user,
      permission: application.permission,
      answers: application.answers,
      status: application.status,
      processed_by: application.processed_by,
    }));

    await kv.set(PENDING_APPLICATION_CACHE_KEY, pendingAppCache);
  }

  return pendingAppCache;
};

export const createNewApplication = async (
  user_id: User['id'],
  permission_id: Permission['id'],
  answers: Application['answers']
) => {
  const application = await prisma.application.create({
    data: {
      user_id,
      permission_id,
      answers,
      status: 'PENDING',
    },
  });

  // Clear caches after creating a new application
  await kv.del(APPLICATION_CACHE_KEY);
  await kv.del(PENDING_APPLICATION_CACHE_KEY);

  return application;
};
