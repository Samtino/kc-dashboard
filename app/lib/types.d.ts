export type User =
  | {
      id: string;
      name: string;
      avatar: string;
      isAdmin: boolean;
      isCS: boolean;
    }
  | undefined;
