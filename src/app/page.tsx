'use client';

import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck, IconBrandGithub, IconBrandDiscord } from '@tabler/icons-react';
import logo from '@/src/public/icon.png';
import classes from './Landing.module.css';
import { ColorSchemeToggle } from '@/src/components';

export default function Landing() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            {/* A <span className={classes.highlight}>modern</span> React <br /> components library */}
            Welcome to the Karma Community Permissions Dashbard
          </Title>
          <Text c="dimmed" mt="md">
            Please report any issues you find directly to the Karma Community Discord server.
          </Text>

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
            <p>
              This is still under development and there are bound to be missing features or bugs
            </p>

            <h3>You can: </h3>
            <List.Item>View your current permissions</List.Item>
            <List.Item>Apply for new permissions</List.Item>
            <List.Item>View the status of your permission applications</List.Item>
          </List>

          <Group mt={30}>
            {/* <Button radius="xl" size="md" className={classes.control}>
              Get started
            </Button>
            <Button variant="default" radius="xl" size="md" className={classes.control}>
              Source code
            </Button> */}
            <Button
              component="a"
              href="/api/auth/discord/login"
              leftSection={<IconBrandDiscord />}
              radius="xl"
              size="md"
              className={classes.control}
              color="#7289DA"
            >
              Sign in with Discord
            </Button>
            <ColorSchemeToggle />
          </Group>
        </div>
        <Image src={logo.src} className={classes.image} />
      </div>

      {/* <iframe
        src="https://github.com/Samtino/kc-dashboard/issues"
        title="GitHub Issues"
        // style={{ width: '100%', height: '600px', border: 'none' }}
      /> */}
      {/* <Button variant="link" radius="xl" size="md" className={classes.control}> */}

      <Button
        component="a"
        target="_blank"
        href="https://github.com/Samtino/kc-dashboard/issues"
        leftSection={<IconBrandGithub />}
        radius="xl"
        size="md"
        className={classes.control}
        color="#2b3137"
      >
        Report an issue on GitHub
      </Button>
    </Container>
  );
}
