'use server';

import { Application, Permission, User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ApplicationData } from '@/lib/types';

let applicationCache: ApplicationData[] | null = null;
let pendingApplicationCache: ApplicationData[] | null = null;

export const getApplicationData = async (): Promise<ApplicationData[]> => {
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
  }

  return applicationCache;
};

export const getPendingApplications = async (): Promise<ApplicationData[]> => {
  if (!pendingApplicationCache) {
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

    pendingApplicationCache = applications.map((application) => ({
      id: application.id,
      application,
      user: application.user,
      permission: application.permission,
      answers: application.answers,
      status: application.status,
      processed_by: application.processed_by,
    }));
  }

  return pendingApplicationCache;
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

  return application;
};
