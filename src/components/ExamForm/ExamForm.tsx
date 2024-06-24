import { Permission } from '@prisma/client';

export function ExamForm({ type }: { type: Permission['name'] }) {
  return (
    <div>
      <h1>Exam Form: {type}</h1>
    </div>
  );
}
