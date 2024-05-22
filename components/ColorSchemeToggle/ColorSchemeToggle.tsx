'use client';

// import { Button, Group, useMantineColorScheme } from '@mantine/core';

// export function ColorSchemeToggle() {
//   const { setColorScheme } = useMantineColorScheme();

//   return (
//     <Group justify="center" mt="xl">
//       <Button onClick={() => setColorScheme('light')}>Light</Button>
//       <Button onClick={() => setColorScheme('dark')}>Dark</Button>
//       <Button onClick={() => setColorScheme('auto')}>Auto</Button>
//     </Group>
//   );
// }

import cx from 'clsx';
import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Group,
  Tooltip,
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import classes from './ColorSchemeToggle.module.css';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <Group justify="center">
      <Tooltip
        offset={10}
        label={`Enable ${computedColorScheme === 'light' ? 'dark' : 'light'} mode`}
      >
        <ActionIcon
          onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
          variant="default"
          size="xl"
          aria-label="Toggle color scheme"
        >
          <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
          <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
