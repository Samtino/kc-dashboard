'use client';

import { AppShell, Group, Code, ScrollArea, Image } from '@mantine/core';
import NextImage from 'next/image';
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import icon from '@/public/icon.png';
import { UserButton } from '@/components/UserButton/UserButton';
import { LinksGroup } from '@/components/LinksGroup/LinksGroup';
import classes from './Dashboard.module.css';

const mockdata = [
  { label: 'Dashboard', icon: IconGauge },
  {
    label: 'Market news',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Overview', link: '/overview' },
      { label: 'Forecasts', link: '/' },
      { label: 'Outlook', link: '/' },
      { label: 'Real time', link: '/' },
    ],
  },
  {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
  { label: 'Analytics', icon: IconPresentationAnalytics },
  { label: 'Contracts', icon: IconFileAnalytics },
  { label: 'Settings', icon: IconAdjustments },
  {
    label: 'Security',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' },
    ],
  },
];

export default function NavbarNested() {
  const [opened, { toggle }] = useDisclosure();

  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: { base: 300, md: 350, lg: 300 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      withBorder={false}
    >
      {/* <AppShell.Header>
        <span>Dashboard</span>
      </AppShell.Header> */}

      <AppShell.Navbar py="md" px={4}>
        <nav className={classes.navbar}>
          <div className={classes.header}>
            <Group justify="space-between">
              <Image component={NextImage} src={icon} alt="KC Logo" h={40} w={40}></Image>
              <h1>Current Page</h1>
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

      <AppShell.Main>Page</AppShell.Main>
    </AppShell>
  );
}
