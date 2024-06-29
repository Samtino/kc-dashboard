import { Image, Container, Title, Group, Text, Alert } from '@mantine/core';
import logo from '@/src/public/icon.png';
import classes from './Landing.module.css';
import { ColorSchemeToggle } from '@/src/components/ColorSchemeToggle/ColorSchemeToggle';
import { FeaturesList } from './LandingComponents';
import { DiscordLoginButton, GithubIssuesButton } from '../components/Buttons/Buttons';

export default async function Landing() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Welcome to the Karma Community{' '}
            <Text
              component="span"
              inherit
              variant="gradient"
              gradient={{ from: 'green', to: 'blue' }}
            >
              {' '}
              Permissions Dashboard{' '}
            </Text>{' '}
          </Title>
          {/* <Text c="dimmed" mt="md">
            Please report any issues you find directly to the Karma Community Discord server.
          </Text> */}
          <Alert variant="light" color="red" title="Disclaimer" radius={10} mt="md">
            <Text c="dimmed">
              This is still under development and there are bound to be missing features or bugs.
              Please report any issues or suggestions to the GitHub to improve the product!
            </Text>
          </Alert>

          <FeaturesList />

          <Group mt={30}>
            <DiscordLoginButton />
            <ColorSchemeToggle />
          </Group>

          <br />

          <GithubIssuesButton />
        </div>
        <Image src={logo.src} className={classes.image} />
      </div>
    </Container>
  );
}
