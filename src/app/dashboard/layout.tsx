'use client';

import { useEffect, useState } from 'react';
import { AppShell, Group, ScrollArea, Image, Burger, Loader, Center } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import NextImage from 'next/image';
import { IconLock, IconSword, IconShield, IconSwords, IconLayoutBoard } from '@tabler/icons-react';
import { ColorSchemeToggle, LinksGroup, UserButton } from '@/src/components';
import classes from './Dashboard.module.css';
import icon from '@/src/public/icon.png';
import { IUser } from '@/src/Model/User';
// import { User } from '@/lib/types';

const mockdata = [
  { label: 'Dashboard', icon: IconLayoutBoard, link: '/dashboard' },
  {
    label: 'Permissions',
    icon: IconLock,
    initiallyOpened: true,
    links: [
      { label: 'Overview', link: '/dashboard/permissions' },
      { label: 'SOPs', link: '/dashboard/permissions/sops' },
      { label: 'Rules', link: '/dashboard/permissions/rules' },
    ],
  },
  {
    label: 'KOG',
    icon: IconSwords,
    initiallyOpened: false,
    links: [
      { label: 'Overview', link: '/dashboard/kog' },
      { label: 'Roster', link: '/dashboard/kog/roster' },
      { label: 'Events', link: '/dashboard/kog/events' },
      { label: 'OCAP', link: '/dashboard/kog/ocap' },
    ],
    requiredPermission: ['KOG'],
  },
  {
    label: 'KT',
    icon: IconSword,
    initiallyOpened: false,
    links: [
      { label: 'Overview', link: '/dashboard/kt' },
      { label: 'Roster', link: '/dashboard/kt/roster' },
      { label: 'Events', link: '/dashboard/kt/events' },
      { label: 'OCAP', link: '/dashboard/kt/ocap' },
    ],
    requiredPermission: ['KT'],
  },
  {
    label: 'Admin Panel',
    icon: IconShield,
    initiallyOpened: true,
    links: [
      { label: 'Overview', link: '/dashboard/admin' },
      { label: 'Applications', link: '/dashboard/admin/apps' },
      { label: 'Events', link: '/dashboard/admin/events' },
    ],
    requiredPermission: ['Admin', 'CS'],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user-data');
        const fetchedUser = await response.json();

        if (fetchedUser.error) {
          throw new Error(fetchedUser.error);
        }

        setUser(fetchedUser);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  if (!user) {
    return <div>Error loading user data</div>; // Handle error state as needed
  }

  const allowedSections = mockdata.filter((section) => {
    if (!section.requiredPermission) return true;
    return section.requiredPermission.some((permission) => {
      if (permission === 'KOG') return user.roles.KOG;
      if (permission === 'KT') return user.roles.KT;
      if (permission === 'Admin') return user.roles.admin;
      if (permission === 'CS') return user.roles.cs;
      return false;
    });
  });

  const links = allowedSections.map((item) => <LinksGroup {...item} key={item.label} />);

  const currentPage = 'Dashboard'; // TODO: get current page from router

  return (
    <AppShell
      // header={{ height: { base: 40 } }} // TODO: only show header on mobile
      navbar={{
        width: { base: 300, lg: 350 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      withBorder={false}
    >
      <Burger
        className={classes.burger}
        opened={opened}
        onClick={toggle}
        hiddenFrom="sm"
        size="sm"
      />
      {/* <AppShell.Header>
      </AppShell.Header> */}
      <AppShell.Navbar p="md">
        <nav className={classes.navbar}>
          <div className={classes.header}>
            <Group justify="space-between">
              <Image component={NextImage} src={icon} alt="KC Logo" h={40} w={40}></Image>
              <h4>{currentPage}</h4>
              <ColorSchemeToggle radius={10} />
            </Group>
          </div>

          <ScrollArea className={classes.links}>
            <div className={classes.linksInner}>{links}</div>
          </ScrollArea>

          <div className={classes.footer}>
            <UserButton />
          </div>
        </nav>
      </AppShell.Navbar>

      <AppShell.Main hidden={opened}>{children}</AppShell.Main>
    </AppShell>
  );
}
