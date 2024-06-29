'use client';

import { Button } from '@mantine/core';
import Link from 'next/link';
import { IconBrandDiscord, IconBrandGithub } from '@tabler/icons-react';
import { login } from '@/src/services/auth';

export function DiscordLoginButton() {
  const handleClicked = async () => {
    await login();
  };

  return (
    <Button
      leftSection={<IconBrandDiscord />}
      radius="xl"
      size="md"
      color="#7289DA"
      onClick={() => {
        handleClicked();
      }}
    >
      Sign in with Discord
    </Button>
  );
}

export function GithubIssuesButton() {
  return (
    <Button
      component={Link}
      target="_blank"
      href="https://github.com/Samtino/kc-dashboard/issues"
      leftSection={<IconBrandGithub />}
      radius="xl"
      size="md"
      color="#2b3137"
    >
      Report an issue on GitHub
    </Button>
  );
}
