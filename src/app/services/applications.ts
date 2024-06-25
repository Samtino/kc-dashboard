'use server';

import { Application, Permission, User } from '@prisma/client';
import prisma from '@/src/db';

export async function createNewApplication(
  user_id: User['id'],
  permission_id: Permission['id'],
  answers: Application['answers']
): Promise<Application | undefined> {
  try {
    const application = await prisma.application.create({
      data: {
        user_id,
        permission_id,
        answers,
        status: 'PENDING',
      },
    });

    return application;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function getPendingApplications(): Promise<Application[]> {
  try {
    const applications = await prisma.application.findMany({
      where: {
        status: 'PENDING',
      },
    });

    if (!applications) {
      return [];
    }

    return applications;
  } catch (error) {
    console.error(error);
    return [];
  }
}
