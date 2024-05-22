import { UnstyledButton, Group, Avatar, Text, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import classes from './UserButton.module.css';
import { User } from '@/app/lib/types';

export function UserButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user-data')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setUser(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <UnstyledButton className={classes.user}>
        <Group>
          <Avatar radius="xl" />
          <Text size="sm" fw={500}>
            Loading...
          </Text>
        </Group>
      </UnstyledButton>
    );
  }

  if (error || !user) {
    return (
      <UnstyledButton className={classes.user}>
        <Group>
          <Avatar radius="xl" />
          <Text size="sm" fw={500}>
            Error loading user
          </Text>
        </Group>
      </UnstyledButton>
    );
  }

  return (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar src={user.avatar} radius="xl" />
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {user.name}
          </Text>
          <Text c="dimmed" size="xs">
            {user.id}
          </Text>
        </div>
        <IconChevronRight style={{ width: rem(10), height: rem(10) }} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}
