import { Button } from '@mantine/core';
import Link from 'next/link';

export default function SopsPage() {
  return (
    <>
      <h1>Liberation Rules</h1>
      <p>Coming soon!</p>

      <br />

      <Button
        component={Link}
        href="https://forums.karmakut.com/index.php?/forumslibinforules/armalibsops/"
        target="_blank"
      >
        View Rules on the KC Forums
      </Button>
    </>
  );
}
