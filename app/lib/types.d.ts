export type User =
  | {
      id: string;
      name: string;
      avatar: string;
      isKOG?: boolean;
      isKT?: boolean;
      isAdmin?: boolean;
      isCS?: boolean;
      permissions?: Permission[];
    }
  | undefined;

export type Permission = {
  id: number;
  name: string;
  callSign?: string;
  assetPerm: boolean;
  requiredHours: 0 | 50 | 100;
  requiredPerms?: number[];
  status: {
    type: 'passed' | 'failed' | 'pending' | 'blacklisted';
    reviewer?: User;
    reason?: string;
    reapplyDate?: Date;
  };
  strikes?: {
    warning?: {
      reason: string;
      date: Date;
    };
    strike1?: {
      reason: string;
      date: Date;
    };
    strike2?: {
      reason: string;
      date: Date;
    };
  };
};

export const Permissions: Permission[] = [
  {
    id: 1,
    name: 'Company Commander',
    callSign: '6-6',
    requiredHours: 100,
    assetPerm: false,
  },
  {
    id: 2,
    name: 'Platoon Leader',
    callSign: '1-6',
    requiredHours: 50,
    assetPerm: false,
  },
  {
    id: 3,
    name: 'Platoon TACP',
    callSign: '1-8',
    requiredHours: 100,
    assetPerm: true,
  },
  {
    id: 4,
    name: 'Platoon Medic',
    callSign: '1-9',
    requiredHours: 50,
    assetPerm: false,
  },
  {
    id: 5,
    name: 'Squad Leader / Support Team Leader',
    requiredHours: 50,
    assetPerm: false,
  },
  {
    id: 6,
    name: 'Banshee',
    requiredHours: 50,
    requiredPerms: [4], // Platoon Medic
    assetPerm: true,
  },
  {
    id: 7,
    name: 'Butcher',
    requiredHours: 50,
    assetPerm: true,
  },
  {
    id: 8,
    name: 'Phantom',
    requiredHours: 100,
    requiredPerms: [2, 3], // Platoon Leader, Platoon TACP
  },
  {
    id: 9,
    name: 'Rotary Logistics',
    callSign: 'Stalker / Chevy',
    requiredHours: 50,
    assetPerm: true,
  },
  {
    id: 10,
    name: 'Rotary CAS',
    callSign: 'Demon',
    requiredHours: 50,
    requiredPerms: [9], // Rotary Logistics
    assetPerm: true,
  },
  {
    id: 11,
    name: 'Fixed Wing CAS',
    callSign: 'Reaper',
    requiredHours: 50,
    requiredPerms: [9], // Rotary Logistics
    assetPerm: true,
  },
];
