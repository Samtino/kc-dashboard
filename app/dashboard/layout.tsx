'use client';

import { AppShell, Group, ScrollArea, Image, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import NextImage from 'next/image';
import { IconLock, IconHome } from '@tabler/icons-react';
import { ColorSchemeToggle, LinksGroup, UserButton } from '@/components';
import classes from './Dashboard.module.css';
import icon from '@/public/icon.png';

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
];

/* Menu example
{ label: 'Lable Name', icon: IconHere, link: '/dashboard' },

// Submenu example
{
  label: 'Menu Name',
  icon: IconHere,
  initiallyOpened: false,
  links: [
    { label: 'submenu1', link: '/dashboard/menuname' },
    { label: 'SOPs', link: '/dashboard/menuname/sops' },
    { label: 'Rules', link: '/dashboard/menuname/rules' },
  ],
},
*/

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  const currentPage = 'Dashboard'; // TODO: get current page from router

  return (
    <AppShell
      header={{ height: { base: 40 } }} // TODO: only show header on mobile
      navbar={{
        width: { base: 300, lg: 350 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      withBorder={false}
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </AppShell.Header>
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

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
