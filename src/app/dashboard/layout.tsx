'use client';

import { AppShell, Group, Burger, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Navbar } from './Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <AppShell
      padding={{ base: 'md', lg: 'lg' }}
      header={{ collapsed: !isMobile, height: 60 }}
      navbar={{
        width: { base: 300 },
        breakpoint: 'sm',
        collapsed: { mobile: opened },
      }}
      withBorder={false}
    >
      {isMobile && (
        <AppShell.Header>
          <Group>
            <Burger opened={opened} onClick={toggle} size="sm" />
            Toggle Sidebar
          </Group>
        </AppShell.Header>
      )}

      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
