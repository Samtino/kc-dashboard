import type {
  Application,
  Permission,
  Question,
  Strike,
  User,
  UserPermission,
} from '@prisma/client';

// Database item data types
export type UserData = {
  id: User['id'];
  user: User;
  permissions: UserPermission[];
  applications: Application[];
  strikes: Strike[];
};

export type PermissionData = {
  id: Permission['id'];
  permission: Permission;
  questions: Question[];
  prerequisites: Permission[];
  prerequisitesFor: Permission[];
};

type ActionType = 'view' | 'edit' | 'send' | 'delete' | 'denied' | 'prereqs';

// Application question data types
export interface QuestionProps {
  question: MultipleChoiceQuestion;
  selectedValue: string;
  onSelect: (id: Question['id'], value: string) => void;
}

export type MultipleChoiceQuestion = {
  id: Question['id'];
  text: Question['text'];
  image_url: Question['image_url'];
  permission_id: Question['permission_id'];
  type: Question['type'];
  question_data: {
    options: string[];
    correct_answer: string;
  };
};
