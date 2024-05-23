export type User =
  | {
      id: string;
      name: string;
      avatar: string;
      isKOG?: boolean;
      isKT?: boolean;
      isAdmin?: boolean;
      isCS?: boolean;
      isSysAdmin?: boolean;
      permissions?: Permission[];
    }
  | undefined;

export type permission = {
  id: number;
  name: string;
  callSign?: string;
  assetPerm: boolean;
  requiredHours: 0 | 50 | 100;
  requiredPerms?: number[];
  status?: {
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
