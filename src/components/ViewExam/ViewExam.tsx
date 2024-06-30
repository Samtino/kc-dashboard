import { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Fieldset, Group, Loader, Stack } from '@mantine/core';
import Link from 'next/link';
// import { getUserById } from '@/src/services/user';
// import { getQuestions } from '@/src/services/permissions';
import { ApplicationData, MultipleChoiceQuestion, PermissionData, UserData } from '@/lib/types';
import { getUserData } from '@/src/services/user';
import { getPermissionData } from '@/src/services/permissions';

export function ViewExam({ app }: { app: ApplicationData }) {
  // const [user, setUser] = useState<User>();
  // const [permission, setPermission] = useState<Question[]>();
  const [userData, setUserData] = useState<UserData>();
  const [permission, setPermission] = useState<PermissionData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // const userData = await getUserById(app.user_id);
      // if (!userData) {
      //   throw new Error('User not found');
      // }
      // const permissionData = await getQuestions(app.permission_id);
      // if (!permissionData) {
      //   throw new Error('Permission not found');
      // }
      // setUser(userData);
      // setPermission(permissionData);
      // const userData = getUserData(app.user_id);
      const permissionData = await getPermissionData();
      const currentPermissions = permissionData.find(
        (perm) => perm.permission.id === app.permission.id
      );

      setUserData(await getUserData(app.user.discord_id));
      setPermission(currentPermissions);
    };

    fetchData().then(() => setLoading(false));
  }, [userData, permission]);

  if (loading) {
    return <Loader />;
  }

  const daysSinceSubmit = Math.floor(
    (new Date().getTime() - new Date(app.application.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <Fieldset m={20} legend={userData?.user.discord_username}>
        <Group justify="space-between">
          <Group wrap="wrap">
            <Avatar src={userData?.user.discord_avatar_url} alt={userData?.user.discord_username} />
            <p>SteamID: {userData?.user.steam_id}</p>
            <p>BMID: {userData?.user.bmid}</p>
          </Group>
          <Badge color={daysSinceSubmit > 14 ? 'red' : 'green'}>
            Days since submitted: {daysSinceSubmit}
          </Badge>
        </Group>
        <p>Answers:</p>
        <Stack>
          {permission?.questions.map((question) => {
            let isCorrect;
            let answer;
            if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
              const { question_data } = question as MultipleChoiceQuestion;
              let { options } = question_data;

              if (!options && question.type === 'TRUE_FALSE') {
                options = ['True', 'False'];
              }

              isCorrect = app.answers.includes(question_data.correct_answer);
              answer = app.answers.find((ans) => options.includes(ans));

              return (
                <Fieldset key={question.id} legend={question.text}>
                  <Badge color={isCorrect ? 'green' : 'red'} variant="light">
                    {answer}
                  </Badge>
                </Fieldset>
              );
            }

            return <p key={question.id}>{question.type} is not handled</p>;
          })}
        </Stack>

        <p>Actions:</p>
        <Group align="end">
          <Button
            component={Link}
            href={`https://www.battlemetrics.com/rcon/players/${userData?.user.bmid}`}
            target="_blank"
          >
            Open BM Account
          </Button>
          <Button
            component={Link}
            href={`https://steamcommunity.com/profiles/${userData?.user.steam_id}`}
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
