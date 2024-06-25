import { useEffect, useState } from 'react';
import { Fieldset, Group } from '@mantine/core';
import { Application, User } from '@prisma/client';
import { getUserById } from '@/src/app/services/user';

export function ViewExam({ app }: { app: Application }) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserById(app.user_id);
      if (!userData) {
        throw new Error('User not found');
      }
      setUser(userData);
    };

    fetchUser();
  }, [app.user_id]);

  const daysSinceSubmit = Math.floor(
    (new Date().getTime() - new Date(app.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Fieldset m={10} legend={user?.discord_username}>
      <Group>
        <p>User: {user?.discord_username}</p>
        <p>Submitted: {daysSinceSubmit} days ago</p>
      </Group>
      <p>Reason:</p>
    </Fieldset>
  );
}
