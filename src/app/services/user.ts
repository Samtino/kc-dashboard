import User, { IUser } from '@/src/Model/User';
import connectDB from '../lib/connectDB';

export async function createUser(
  discordID: string,
  discordName: string,
  discordAvatar?: string
): Promise<any> {
  try {
    await connectDB();

    const user = new User({
      discordID,
      discordName,
      discordAvatar,
    });

    await user.save();

    return true;
  } catch (error: any) {
    return false;
  }
}

export async function getUser(discordID: string): Promise<IUser | null> {
  try {
    await connectDB();

    const user = await User.findOne({ discordID });

    return user;
  } catch (error: any) {
    return null;
  }
}

export async function updateRoles(discordID: string, guildData: any): Promise<void> {
  const user = await getUser(discordID);

  if (!user) return;

  guildData.roles.forEach((role: string) => {
    switch (role) {
      case process.env.CS_ROLE_ID:
        user.roles.cs = true;
      /* falls through */
      case process.env.ADMIN_ROLE_ID:
        user.roles.admin = true;
        break;
      case process.env.KOG_ROLE_ID:
      case process.env.MPU_ROLE_ID:
        user.roles.KOG = true;
        break;
      case process.env.KT_ROLE_ID:
        user.roles.KT = true;
        break;
    }
  });

  // FIXME: add sysAdmin id's to .env
  if (user.discordID === '348233630415454208' || user.discordID === '105509397211406336') {
    user.roles.sysAdmin = true;
  }

  user.save();
}
