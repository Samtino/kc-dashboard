import { Button, Container, Table, Tooltip } from '@mantine/core';
import classes from './Permissions.module.css';

type Permission = {
  id: number;
  name: string;
  requiredHours: number;
  status: 'passed' | 'failed' | 'pending' | 'blacklisted' | 'never';
  reviewer?: string;
  reason?: string;
  reapplyDate?: Date;
};

function PermissionStatus({ permission }: { permission: Permission }) {
  switch (permission.status) {
    case 'passed':
      return (
        <Button color="green" w={120}>
          Passed
        </Button>
      );
    case 'failed':
      if ((permission.reapplyDate || 0) < new Date(Date.now())) {
        return (
          <Tooltip label={`You can reapply at: ${permission.reapplyDate?.toLocaleString()}`}>
            <Button disabled color="red" w={120}>
              Failed
            </Button>
          </Tooltip>
        );
      }
      return (
        <Tooltip label="You can reapply now">
          <Button color="red" w={120}>
            Failed
          </Button>
        </Tooltip>
      );

    case 'pending':
      return (
        <Button color="yellow" w={120}>
          Pending
        </Button>
      );
    case 'blacklisted':
      return (
        <Tooltip label={`You have been blacklisted for: ${permission.reason}`}>
          <Button disabled color="black" w={120}>
            Blacklisted
          </Button>
        </Tooltip>
      );
    case 'never':
      return (
        <Button color="gray" w={120}>
          Never
        </Button>
      );
  }
}

export default function Permissions() {
  const placeholder: Permission[] = [
    { id: 0, name: 'Company Command', requiredHours: 100, status: 'passed' },
    {
      id: 1,
      name: 'Platoon Command',
      requiredHours: 50,
      status: 'failed',
      reapplyDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      reason: 'Not enough hours',
    },
    { id: 2, name: 'Squad Leader', requiredHours: 50, status: 'pending' },
    {
      id: 3,
      name: 'Fireteam Leader',
      requiredHours: 25,
      status: 'blacklisted',
      reviewer: 'John Doe',
      reason: '2 Strikes',
    },
    { id: 4, name: 'Rifleman', requiredHours: 0, status: 'never' },
  ];

  return (
    <>
      <h1>Permissions Overview</h1>
      <p>Work in progress!</p>

      <br />

      <Container size="lg" h="100%">
        <Table className={classes.table} striped highlightOnHover>
          <thead>
            <tr>
              <th>Permission</th>
              <th>Required Hours</th>
              <th>Obtained</th>
            </tr>
          </thead>
          <tbody>
            {placeholder.map((permission) => (
              <tr key={permission.id}>
                <td width={200}>{permission.name}</td>
                <td width={40}>{permission.requiredHours}</td>
                <td width={200}>
                  <PermissionStatus permission={permission} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}
