import { useState } from 'react';
import { Button, Center, Group, Paper, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { fetchBMID, fetchSteamAccount, updateUser, updateUserCookie } from '@/src/services/user';
import { UserData } from '@/lib/types';

export const SteamID = ({ userData }: { userData: UserData }) => {
  const [steamResponse, setSteamResponse] = useState<any>();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      steamId: '',
    },
    validate: {
      steamId: (value) => (/^(\d{17})$/.test(value) ? null : 'Invalid SteamID'),
    },
  });

  const handleSubmit = async (values: { steamId: string }) => {
    const data = await fetchSteamAccount(values.steamId);

    setSteamResponse(data);
  };

  const confirmClick = async () => {
    const bmid = await fetchBMID(steamResponse.steamid);

    if (bmid) {
      await updateUser(userData.user.id, { steam_id: steamResponse.steamid, bmid });
      await updateUserCookie(userData.user.discord_id).then(() => window.location.reload());
    } else {
      console.error('Failed to fetch BMID');
    }
  };

  return (
    <Paper withBorder radius={20} m={20}>
      <Center>
        <h1>Temporary solution to manually assigning SteamIDs</h1>
      </Center>

      <h2>Your info</h2>
      <Group justify="space-evenly" mt="md">
        <p>Discord ID: {userData.user.discord_id}</p>
        <p>Discord Username: {userData.user.discord_username}</p>
        <p>SteamID: {userData.user.steam_id}</p>
        <p>BMID: {userData.user.bmid}</p>
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack mt="md" p={20}>
          <TextInput
            label="Steam ID:"
            placeholder="76561197960287930"
            inputMode="numeric"
            key={form.key('steamId')}
            {...form.getInputProps('steamId')}
          />
          <Button type="submit">Submit</Button>
        </Stack>
      </form>

      <Group p={20}>
        {steamResponse && (
          <div>
            <h2>Is this your account?</h2>
            <Group>
              <h3>{steamResponse.personaname}</h3>
              <img src={steamResponse.avatar} alt="Steam Avatar" />
            </Group>

            <Button onClick={confirmClick}>Confirm</Button>
          </div>
        )}
      </Group>
    </Paper>
  );
};
