'use client';

import { List, rem, ThemeIcon } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export function FeaturesList() {
  return (
    <List
      mt={30}
      spacing="sm"
      size="sm"
      icon={
        <ThemeIcon size={20} radius="xl">
          <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
        </ThemeIcon>
      }
    >
      <h3>You can: </h3>
      <List.Item>View your current permissions</List.Item>
      <List.Item>Apply for new permissions</List.Item>
      <List.Item>View the status of your permission applications</List.Item>
    </List>
  );
}
