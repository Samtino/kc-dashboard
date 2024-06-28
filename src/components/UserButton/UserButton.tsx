import { UnstyledButton, Group, Avatar, Text, rem, Menu, Divider, Collapse } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { User } from '@prisma/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import classes from './UserButton.module.css';
import { getCurrentUser } from '@/src/services/user';

// FIXME: Fix popup menu not appearing for any other than the success case (user is loaded)

function UserCard({ user }: { user: User | null }) {
  return (
    <>
      <Avatar src={user?.discord_avatar_url} radius="xl" />
      <div className="usercard">
        <Text size="sm" fw={500}>
          {user?.discord_username || 'Loading...'}
        </Text>
        <Text c="dimmed" size="xs">
          {user?.discord_id || ''}
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
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <Menu.Item className={classes.menu} color="red" component={Link} href="/api/auth/logout">
            Logout
          </Menu.Item>
        </Menu>
      </Collapse>
    );
  }

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
          <UserCard user={user as User} />
          <Chevron />
        </Group>
      </UnstyledButton>
    </>
  );
}
