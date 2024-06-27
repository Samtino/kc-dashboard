export type UserData = {
  id: User['id'];
  user: User;
  userPerms: UserPermission[];
  applications: Application[];
  strikes: Strike[];
};

type ActionType = 'view' | 'edit' | 'send' | 'delete' | 'denied' | 'prereqs';

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
