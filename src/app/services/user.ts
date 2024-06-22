import type { User } from '@prisma/client';
import prisma from '@/src/db';

export async function createUser(
  discord_id: string,
  discord_username: string,
  discord_avatar_url?: string
): Promise<boolean> {
  try {
    await prisma.user.create({
      data: {
        discord_id,
        discord_username,
        discord_avatar_url,
      },
    });
    return true;
  } catch (error: any) {
    return false;
  }
}

export async function updateUser(
  discord_id: string,
  discord_username: string,
  discord_avatar_url?: string
): Promise<boolean> {
  try {
    const user = await getUser(discord_id);
    if (!user) return false;

    prisma.user.update({
      where: {
        discord_id,
      },
      data: {
        discord_username,
        discord_avatar_url,
      },
    });

    return true;
  } catch (error: any) {
    return false;
  }
}

export async function getUser(discord_id: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: {
        discord_id,
      },
    });
  } catch (error: any) {
    return null;
  }
}

export async function updateRoles(discord_id: string, guildData: any): Promise<boolean> {
  const user = await getUser(discord_id);

  if (!user) return false;

  const roles: User['roles'] = [];
  guildData.roles.forEach((role: String) => {
    switch (role) {
      case process.env.CS_ROLE_ID:
        roles.push('COMMUNITY_STAFF');
        break;
      case process.env.ADMIN_ROLE_ID:
        roles.push('ADMIN');
        break;
      case process.env.KOG_ROLE_ID:
      case process.env.MPU_ROLE_ID:
        roles.push('KOG');
        break;
      case process.env.KT_ROLE_ID:
        roles.push('KT');
        break;
    }
  });

  const sysAdmins = process.env.SYS_ADMIN_IDS?.split(',') || [];
  if (sysAdmins.includes(user.discord_id)) {
    roles.push('SYS_ADMIN');
  }

  await prisma.user.update({
    where: {
      discord_id,
    },
    data: {
      roles,
    },
  });

  return true;
}
