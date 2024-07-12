import { Button } from '@mantine/core';
import Link from 'next/link';

export const metadata = {
  title: 'KC Dashboard - SOPs',
};

export default function SopsPage() {
  return (
    <>
      <h1>Liberation SOPs</h1>
      <p>Coming soon!</p>

      <br />

      <Button
        component={Link}
        href="https://forums.karmakut.com/index.php?/forumslibinforules/armalibsops/"
        target="_blank"
      >
        View SOPs on the KC Forums
      </Button>
    </>
  );
}
