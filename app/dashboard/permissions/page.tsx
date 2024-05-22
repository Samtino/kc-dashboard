import { Container } from '@mantine/core';

type Permission = {
  id: number;
  name: string;
  requiredHours: number;
  obtained: boolean;
};

export default function Permissions() {
  const placeholder: Permission[] = [
    { id: 0, name: 'Company Command', requiredHours: 100, obtained: false },
    { id: 1, name: 'Platoon Command', requiredHours: 50, obtained: false },
    { id: 2, name: 'Squad Leader', requiredHours: 50, obtained: false },
  ];

  return (
    <Container h={1200} w={800}>
      {/* <h1>Permissions</h1>

      <br /> */}
    </Container>
  );
}
