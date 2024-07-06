'use client';

import { useEffect, useState } from 'react';
import {
  AppShell,
  Group,
  ScrollArea,
  Image,
  Burger,
  Loader,
  Center,
  Divider,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import NextImage from 'next/image';
import { IconLock, IconSword, IconShield, IconSwords, IconLayoutBoard } from '@tabler/icons-react';
import { User } from '@prisma/client';
import { ColorSchemeToggle, LinksGroup, UserButton } from '@/src/components';
import classes from './Dashboard.module.css';
import icon from '@/src/public/icon.png';
import { LinksGroupProps } from '@/src/components/NavbarLinksGroup/NavbarLinksGroup';
import { getCurrentUser } from '@/src/services/user';
import { headers } from 'next/headers';
import { Navbar } from './Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      padding={{ base: 'md', lg: 'lg' }}
      navbar={{
        width: { base: 300 },
        breakpoint: 'sm',
        collapsed: { mobile: opened },
      }}
      withBorder={false}
    >
      <AppShell.Header hidden={true}>
        <h1>Header</h1>
      </AppShell.Header>

      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
