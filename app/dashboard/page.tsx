'use client';

import { AppShell, Burger, Group, UnstyledButton, Image, Avatar, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import NextImage from 'next/image';
import classes from './Dashboard.module.css';
import logo from '@/public/icon.png';

export default function Dashboard() {
  const [opened, { toggle }] = useDisclosure();

  function ButtonRow({ dividerDirection }) {
    return (
      <>
        <UnstyledButton className={classes.control}>Dashboard</UnstyledButton>
        <Divider orientation={dividerDirection} />
        <UnstyledButton className={classes.control}>Permissions</UnstyledButton>
        <Divider orientation={dividerDirection} />
        <UnstyledButton className={classes.control}>Forums</UnstyledButton>
        <Divider orientation={dividerDirection} />
        <UnstyledButton className={classes.control}>Support</UnstyledButton>
      </>
    );
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Image component={NextImage} src={logo} alt="KC Logo" h={40} />
            <Group ml="xl" gap={0} visibleFrom="sm">
              <ButtonRow dividerDirection="vertical" />
              <Avatar src={null} className={classes.avatar} />
              {/* TODO: add dropdown for settings and signout */}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <div className={classes.navbar}>
          <div>
            <ButtonRow dividerDirection="horizontal" />
          </div>
          <div>
            <UnstyledButton className={classes.control}>Settings</UnstyledButton>
            <Divider orientation="horizontal" />
            <UnstyledButton className={classes.control}>Logout</UnstyledButton>
          </div>
        </div>
      </AppShell.Navbar>
    </AppShell>
  );
}
