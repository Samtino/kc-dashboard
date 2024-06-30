import { UnstyledButton, Group, Avatar, Text, Menu, Divider, Center } from '@mantine/core';
import { User } from '@prisma/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/src/services/user';
import { logout } from '@/src/services/auth';

export function UserButton() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser.user);
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e: any) {
      console.error(e.message);
    }
  };

  if (loading || !user) {
    return (
      <Center component={UnstyledButton} w="100%" h="8vh" p={10}>
        <Group>
          <Avatar radius="xl" />
          <Text size="sm" fw={500}>
            Loading...
          </Text>
        </Group>
      </Center>
    );
  }

  return (
    <Menu position="top" offset={30} width="target">
      <Center component={UnstyledButton} w="100%" h="8vh">
        <Menu.Target>
          <Group>
            <Avatar src={user.discord_avatar_url} radius="xl" />
            <div>
              <Text size="sm" fw={500}>
                {user.discord_username}
              </Text>
              <Text c="dimmed" size="xs">
                {user.discord_id}
              </Text>
            </div>
          </Group>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>User Settings</Menu.Label>

          <Menu.Item component={Link} href="/settings">
            Settings
          </Menu.Item>

          <Divider />
          <Menu.Label>Danger Zone</Menu.Label>

          <Menu.Item color="red" onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Center>
    </Menu>
  );
}
