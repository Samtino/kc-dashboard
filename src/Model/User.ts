import mongoose, { Document, Schema } from 'mongoose';
import { IPermission } from './Permission';

export interface IUser extends Document {
  discord: {
    id: string;
    name: string;
    avatar: string;
  };
  steamId?: string;
  roles: {
    KOG: boolean;
    KT: boolean;
    admin: boolean;
    cs: boolean;
    sysAdmin: boolean;
  };
  permissions: IPermission[];
}

const userSchema: Schema = new mongoose.Schema({
  discord: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: {
      type: String,
      required: true,
      default: 'https://cdn.discordapp.com/embed/avatars/0.png',
    },
  },
  steamId: { type: String, required: false },
  roles: {
    KOG: { type: Boolean, required: false, default: false },
    KT: { type: Boolean, required: false, default: false },
    admin: { type: Boolean, required: false, default: false },
    cs: { type: Boolean, required: false, default: false },
    sysAdmin: { type: Boolean, required: false, default: false },
  },
  permissions: { type: [Schema.Types.ObjectId], ref: 'Permission', required: false, default: [] },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
