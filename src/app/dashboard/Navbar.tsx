import { useEffect, useState } from 'react';
import { SegmentedControl, Text, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import {
  IconShoppingCart,
  IconBellRinging,
  IconKey,
  IconSettings,
  IconUsers,
  IconLogout,
  IconSwitchHorizontal,
  IconLayoutBoard,
  IconDatabase,
  IconShieldLock,
} from '@tabler/icons-react';
import classes from './Navbar.module.css';
import { User } from '@prisma/client';
import { getCurrentUser } from '@/src/services/user';
import { logout } from '@/src/services/auth';

const standardTabs = {
  dashboard: [
    { link: '/dashboard', label: 'Home', icon: IconLayoutBoard },
    { link: '/dashboard/permissions', label: 'Permissions', icon: IconKey },
    { link: '/dashboard/permissions/sops', label: 'SOPs', icon: IconDatabase },
    { link: '/dashboard/permissions/rules', label: 'Rules', icon: IconShieldLock },
  ],
  kog: [
    { link: '/dashboard/kog', label: 'Overview', icon: IconBellRinging },
    { link: '/dashboard/kog/roster', label: 'Roster', icon: IconUsers },
    { link: '/dashboard/kog/events', label: 'Events', icon: IconShoppingCart },
    { link: '/dashboard/kog/ocap', label: 'OCAP', icon: IconSwitchHorizontal },
  ],
  kt: [
    { link: '/dashboard/kt', label: 'Overview', icon: IconBellRinging },
    { link: '/dashboard/kt/roster', label: 'Roster', icon: IconUsers },
    { link: '/dashboard/kt/events', label: 'Events', icon: IconShoppingCart },
    { link: '/dashboard/kt/ocap', label: 'OCAP', icon: IconSwitchHorizontal },
  ],
  admin: [
    { link: '/dashboard/admin', label: 'Overview', icon: IconBellRinging },
    { link: '/dashboard/admin/applications', label: 'Applications', icon: IconUsers },
    { link: '/dashboard/admin/events', label: 'Events', icon: IconShoppingCart },
  ],
  cs: [
    { link: '/dashboard/cs', label: 'Overview', icon: IconBellRinging },
    { link: '/dashboard/cs/members', label: 'Members', icon: IconUsers },
    { link: '/dashboard/cs/reports', label: 'Reports', icon: IconShoppingCart },
  ],
};

export function Navbar() {
  const [section, setSection] = useState<'dashboard' | 'kog' | 'kt' | 'admin' | 'cs'>('dashboard');
  const [active, setActive] = useState('Home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser.user);
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(e.message);
      }
    };

    fetchData();
  }, []);

  const userRoles = user?.roles || [];

  const segmentData = [
    { label: 'Dashboard', value: 'dashboard' },
    ...(userRoles.includes('KOG') || userRoles.includes('SYS_ADMIN')
      ? [{ label: 'KOG', value: 'kog' }]
      : []),
    ...(userRoles.includes('KT') || userRoles.includes('SYS_ADMIN')
      ? [{ label: 'KT', value: 'kt' }]
      : []),
    ...(userRoles.includes('ADMIN') || userRoles.includes('SYS_ADMIN')
      ? [{ label: 'Admin', value: 'admin' }]
      : []),
    ...(userRoles.includes('COMMUNITY_STAFF') || userRoles.includes('SYS_ADMIN')
      ? [{ label: 'CS', value: 'cs' }]
      : []),
  ];

  const links = standardTabs[section].map((item) => (
    <Link href={item.link} key={item.label} className={classes.link}>
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  };

  return (
    <nav className={classes.navbar}>
      <div>
        <Text fw={500} size="sm" className={classes.title} c="dimmed" mb="xs">
          {user?.discord_username || 'loading...'}
        </Text>

        {userRoles.length > 0 && (
          <SegmentedControl
            orientation="vertical"
            value={section}
            onChange={(value: any) => setSection(value)}
            transitionTimingFunction="ease"
            fullWidth
            data={segmentData}
          />
        )}
      </div>

      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <Link href="/settings" className={classes.link}>
          <IconSettings className={classes.linkIcon} stroke={1.5} />
          <span>Settings</span>
        </Link>

        <UnstyledButton className={classes.link} onClick={handleLogout} w="100%">
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </UnstyledButton>
      </div>
    </nav>
  );
}
