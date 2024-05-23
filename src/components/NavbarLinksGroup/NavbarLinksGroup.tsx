'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Group, Box, Collapse, ThemeIcon, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './NavbarLinksGroup.module.css';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  link?: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  link,
  initiallyOpened,
  links,
}: LinksGroupProps): JSX.Element {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleNavigation = (link: string) => {
    router.push(link);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const items = (hasLinks ? links : []).map((link) => (
    <Text<'div'>
      component="div"
      className={classes.link}
      key={link.label}
      onClick={() => handleNavigation(link.link)}
      role="button"
      tabIndex={0}
      onKeyPress={(event) => {
        if (event.key === 'Enter') handleNavigation(link.link);
      }}
      style={{ cursor: 'pointer' }}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => {
          if (link) {
            handleNavigation(link);
          } else {
            setOpened((o) => !o);
          }
        }}
        className={classes.control}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
