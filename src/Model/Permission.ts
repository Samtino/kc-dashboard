import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission extends Document {
  id: number;
  name: string;
  callSign?: string;
  assetPerm: boolean;
  requiredHours: number;
  requiredPerms?: number[];
  status: {
    type: 'passed' | 'failed' | 'pending' | 'blacklisted';
    reviewer: string;
    reason: string;
    reapplyDate: Date;
  };
  strikes: {
    warning: {
      reason: string;
      date: Date;
    };
    strike1: {
      reason: string;
      date: Date;
    };
    strike2: {
      reason: string;
      date: Date;
    };
  };
}

const permissionSchema: Schema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  callSign: { type: String, required: false },
  assetPerm: { type: Boolean, required: true, default: false },
  requiredHours: { type: Number, required: true, default: 50 },
  requiredPerms: { type: [Number], required: false },
  status: {
    type: {
      type: String,
      enum: ['passed', 'failed', 'pending', 'blacklisted'],
    },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { String },
    reapplyDate: { Date },
  },
  strikes: {
    warning: {
      reason: { type: String },
      date: { type: Date },
    },
    strike1: {
      reason: { type: String },
      date: { type: Date },
    },
    strike2: {
      reason: { type: String },
      date: { type: Date },
    },
  },
});

const Permission =
  mongoose.models.Permission || mongoose.model<IPermission>('Permission', permissionSchema);

export default Permission;
