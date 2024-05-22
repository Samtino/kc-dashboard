'use client';

import { AppShell, Group, Code, ScrollArea, Image, Burger } from '@mantine/core';
import NextImage from 'next/image';
import { IconLock, IconHome } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import icon from '@/public/icon.png';
import { UserButton } from '@/components/UserButton/UserButton';
import { LinksGroup } from '@/components/NavbarLinksGroup/NavbarLinksGroup';
import classes from './Dashboard.module.css';

const mockdata = [
  { label: 'Home', icon: IconHome, link: '/dashboard' },
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
  // Menu example
  // { label: 'Lable Name', icon: IconHere, link: '/dashboard' },
  //
  // Submenu example
  // {
  //   label: 'Menu Name',
  //   icon: IconHere,
  //   initiallyOpened: false,
  //   links: [
  //     { label: 'submenu1', link: '/dashboard/menuname' },
  //     { label: 'SOPs', link: '/dashboard/menuname/sops' },
  //     { label: 'Rules', link: '/dashboard/menuname/rules' },
  //   ],
  // },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  const currentPage = 'Dashboard'; // TODO: get current page from router

  return (
    <AppShell
      navbar={{
        width: { base: 300, lg: 350 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      withBorder={false}
    >
      <AppShell.Navbar p="md">
        <nav className={classes.navbar}>
          <div className={classes.header}>
            <Group justify="space-between">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Image component={NextImage} src={icon} alt="KC Logo" h={40} w={40}></Image>
              <h4>{currentPage}</h4>
              <Code fw={700}>v0.1.0</Code>
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

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
