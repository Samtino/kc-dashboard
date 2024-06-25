import { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Fieldset, Group, Loader, Stack, Text } from '@mantine/core';
import type { Application, Question, User } from '@prisma/client';
import { getUserById } from '@/src/app/services/user';
import { getQuestions } from '@/src/app/services/permissions';
import Link from 'next/link';

export function ViewExam({ app }: { app: Application }) {
  const [user, setUser] = useState<User>();
  const [permission, setPermission] = useState<Question[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserById(app.user_id);
      if (!userData) {
        throw new Error('User not found');
      }

      const permissionData = await getQuestions(app.permission_id);
      if (!permissionData) {
        throw new Error('Permission not found');
      }

      setUser(userData);
      setPermission(permissionData);
    };

    fetchData().then(() => setLoading(false));
  }, [app.user_id]);

  if (loading) {
    return <Loader />;
  }

  const daysSinceSubmit = Math.floor(
    (new Date().getTime() - new Date(app.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <Fieldset m={20} legend={user?.discord_username}>
        <Group justify="space-between">
          <Group wrap="wrap">
            <Avatar src={user?.discord_avatar_url} alt={user?.discord_username} />
            <p>SteamID: {user?.steam_id}</p>
            <p>BMID: {user?.bmid}</p>
          </Group>
          <Badge color={daysSinceSubmit > 14 ? 'red' : 'green'}>
            Days since submitted: {daysSinceSubmit}
          </Badge>
        </Group>
        <p>Answers:</p>
        <Stack>
          {permission?.map((question) => {
            const isCorrect = app.answers.includes(question.correct_answer);
            const answer = app.answers.find((ans) => question.options.includes(ans));
            return (
              <Fieldset key={question.id} legend={question.text}>
                <Badge color={isCorrect ? 'green' : 'red'} variant="light">
                  {answer}
                </Badge>
              </Fieldset>
            );
          })}
        </Stack>

        <p>Actions:</p>
        <Group align="end">
          <Button
            component={Link}
            href={`https://www.battlemetrics.com/rcon/players/${user?.bmid}`}
            target="_blank"
          >
            Open BM Account
          </Button>
          <Button
            component={Link}
            href={`https://steamcommunity.com/profiles/${user?.steam_id}`}
            target="_blank"
          >
            Open Steam Account
          </Button>
          <Button color="red">Fail</Button>
          <Button color="green">Pass</Button>
        </Group>
      </Fieldset>
    </>
  );
}
