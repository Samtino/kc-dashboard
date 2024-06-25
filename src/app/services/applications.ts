'use server';

import { Application } from '@prisma/client';
import prisma from '@/src/db';

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
