import mongoose, { Document, Schema } from 'mongoose';

interface IPermission {
  name: string;
  // status?: 'passed' | 'failed' | 'pending' | 'blacklisted';
  status?: {
    type: 'passed' | 'failed' | 'pending' | 'blacklisted';
    message?: string;
    appliedDate?: Date;
    reviewedDate?: Date;
    reapplyDate?: Date;
    reviewer?: IUser['discordID'];
  };
  strikes?: {
    warning?: { reason: string; date: Date; expires?: Date; by?: string };
    strike1?: { reason: string; date: Date; expires?: Date; by?: string };
    strike2?: { reason: string; date: Date; expires?: Date; by?: string };
  };
}
const StrikeSchema: Schema = new Schema(
  {
    reason: { type: String, required: true },
    date: { type: Date, required: true },
    expires: { type: Date, required: false },
    by: { type: String, required: false },
  },
  { _id: false }
);

const PermissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['passed', 'failed', 'pending', 'blacklisted'], required: false },
    message: { type: String, required: false },
    appliedDate: { type: Date, required: false },
    reviewedDate: { type: Date, required: false },
    reapplyDate: { type: Date, required: false },
    reviewer: { type: String, required: false },
    strikes: {
      warning: { type: StrikeSchema, required: false },
      strike1: { type: StrikeSchema, required: false },
      strike2: { type: StrikeSchema, required: false },
    },
  },
  { _id: false }
);

interface IUser extends Document {
  discordID: string;
  discordName: string;
  discordAvatar: string;
  steamID?: string;
  BMID?: string;
  roles: {
    KOG?: boolean;
    KT?: boolean;
    admin?: boolean;
    cs?: boolean;
    sysAdmin?: boolean;
  };
  permissions: IPermission[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    discordID: { type: String, required: true },
    discordName: { type: String, required: true },
    discordAvatar: { type: String, required: true },
    steamID: { type: String, required: false },
    BMID: { type: String, required: false },
    roles: {
      KOG: { type: Boolean, default: false },
      KT: { type: Boolean, default: false },
      admin: { type: Boolean, default: false },
      cs: { type: Boolean, default: false },
      sysAdmin: { type: Boolean, default: false },
    },
    permissions: { type: [PermissionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
