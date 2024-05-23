import { UnstyledButton, Group, Avatar, Text, rem, Menu, Divider, Collapse } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import classes from './UserButton.module.css';
import { User } from '@/lib/types';

function UserCard({ user }: { user: User | null }) {
  return (
    <>
      <Avatar src={user?.avatar || null} radius="xl" />
      <div className="usercard">
        <Text size="sm" fw={500}>
          {user?.name || 'Loading...'}
        </Text>
        <Text c="dimmed" size="xs">
          {user?.id || ''}
        </Text>
      </div>
    </>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <>
      <Avatar radius="xl" />
      <Text size="sm" fw={500}>
        Error loading user
      </Text>
      <Text c="red" size="xs">
        {message}
      </Text>
    </>
  );
}

export function UserButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpened, setMenuOpened] = useState(false);

  const userCardClick = () => {
    setMenuOpened(!menuOpened);
  };

  function Chevron() {
    return (
      <>
        <IconChevronRight
          className={classes.chevron}
          style={{
            width: rem(10),
            height: rem(10),
            transform: menuOpened ? 'rotate(-90deg)' : 'rotate(0)',
          }}
          stroke={1.5}
        />
      </>
    );
  }

  function PopupMenu() {
    return (
      <Collapse in={menuOpened} transitionDuration={200}>
        <Menu position="top">
          <Menu.Item className={classes.menu} component={Link} href="/settings">
            Settings
          </Menu.Item>
          <Divider />
          <Menu.Item
            className={classes.menu}
            color="red"
            component={Link}
            href="/api/auth/discord/logout"
          >
            Logout
          </Menu.Item>
        </Menu>
      </Collapse>
    );
  }

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
          <UserCard user={null} />
          <Chevron />
        </Group>
      </UnstyledButton>
    );
  }

  if (error) {
    return (
      <UnstyledButton className={classes.user}>
        <Group>
          <ErrorCard message="Please logout and login" />
          <Chevron />
        </Group>
      </UnstyledButton>
    );
  }

  return (
    <>
      <PopupMenu />
      <UnstyledButton className={classes.user} onClick={userCardClick}>
        <Group justify="space-between">
          <UserCard user={user} />
          <Chevron />
        </Group>
      </UnstyledButton>
    </>
  );
}
