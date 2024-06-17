import User, { IUser } from '@/src/Model/User';
import connectDB from '../lib/connectDB';

export async function createUser(
  discordID: string,
  discordName: string,
  discordAvatar?: string
): Promise<any> {
  try {
    await connectDB();

    console.log('Creating user');

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
