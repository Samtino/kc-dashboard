import { ActionIcon, Badge, Center, Group, Paper, rem, Table, Tooltip } from '@mantine/core';
import { Icon, IconPencil, IconSend, IconTrash, IconZoom } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { ExamModal } from '../ExamModal/ExamModal';

// TODO: replace dummy data with real data from the DB
type Perm = {
  name: string;
  status: 'passed' | 'failed' | 'pending' | 'blacklisted' | 'None';
  requiredHours: 0 | 50 | 100;
  prereqs?: Perm[];
  strikes?: {
    warning?: { reason: string; date: Date; expires?: Date; by?: string };
    strike1?: { reason: string; date: Date; expires?: Date; by?: string };
    strike2?: { reason: string; date: Date; expires?: Date; by?: string };
  };
};

const cc: Perm = {
  name: 'Company Command',
  status: 'passed',
  requiredHours: 100,
  strikes: {
    warning: {
      reason: 'Not attending meetings',
      date: new Date(),
      expires: new Date(),
      by: 'Admin',
    },
  },
};
const pl: Perm = {
  name: 'Platoon Leader',
  status: 'failed',
  requiredHours: 100,
};
const tacp: Perm = {
  name: 'Platoon TACP',
  status: 'pending',
  requiredHours: 100,
};
const plMedic: Perm = {
  name: 'Platoon Medic',
  status: 'blacklisted',
  requiredHours: 50,
};
const sl: Perm = {
  name: 'Squad Leader / Support Team Leader',
  status: 'None',
  requiredHours: 50,
};

const standardPerms: Perm[] = [cc, pl, tacp, plMedic, sl];

const banshee: Perm = {
  name: 'Banshee',
  status: 'passed',
  requiredHours: 50,
  prereqs: [plMedic],
};
const butcher: Perm = {
  name: 'Butcher',
  status: 'failed',
  requiredHours: 50,
};
const phantom: Perm = {
  name: 'Phantom',
  status: 'pending',
  requiredHours: 100,
  prereqs: [cc, tacp],
};
const rotaryLogi: Perm = {
  name: 'Rotary Logistics',
  status: 'blacklisted',
  requiredHours: 50,
};
const rotaryCAS: Perm = {
  name: 'Rotary CAS',
  status: 'None',
  requiredHours: 50,
  prereqs: [rotaryLogi],
};
const fixedWing: Perm = {
  name: 'Fixed Wing CAS',
  status: 'None',
  requiredHours: 50,
  prereqs: [rotaryLogi],
};

const assetPerms = [banshee, butcher, phantom, rotaryLogi, rotaryCAS, fixedWing];

const statusColors: Record<string, string> = {
  passed: 'green',
  failed: 'red',
  pending: 'yellow',
  blacklisted: 'black',
  none: 'gray',
};

function GetStrikeBadges({ strikes }: { strikes: Perm['strikes'] }) {
  const warningBadge = (
    <Badge color={strikes?.warning ? 'yellow' : 'gray'} variant="filled" circle>
      W
    </Badge>
  );
  const strike1Badge = (
    <Badge color={strikes?.strike1 ? 'red' : 'gray'} variant="light" circle>
      1
    </Badge>
  );
  const strike2Badge = (
    <Badge color={strikes?.strike2 ? 'red' : 'gray'} variant="light" circle>
      2
    </Badge>
  );

  return (
    <Group justify="center">
      {warningBadge}
      {strike1Badge}
      {strike2Badge}
    </Group>
  );
}

function GetPrereqs({ prereqs }: { prereqs: Perm['prereqs'] }) {
  if (!prereqs) {
    return <Badge color="gray">None</Badge>;
  }

  // TODO: change color based on status of prereq
  return prereqs.map((item) => (
    <Badge key={item.name} color="green" variant="light">
      {item.name}
    </Badge>
  ));
}

function GetActionButton({ actionType }: { actionType: string }) {
  const actionConfig: Record<
    string,
    { label: string; icon: Icon; color: string; variant: string }
  > = {
    view: {
      label: 'View',
      icon: IconZoom,
      color: 'gray',
      variant: 'subtle',
    },
    send: {
      label: 'Send',
      icon: IconSend,
      color: 'gray',
      variant: 'subtle',
    },
    edit: {
      label: 'Edit',
      icon: IconPencil,
      color: 'gray',
      variant: 'subtle',
    },
    delete: {
      label: 'Delete',
      icon: IconTrash,
      color: 'red',
      variant: 'light',
    },
  };

  const action = actionConfig[actionType];
  if (!action) return null;

  const { icon: IconComponent, variant, color, label } = action;
  const [hidden, { toggle }] = useDisclosure();

  return (
    <>
      <ExamModal hidden={hidden} toggle={toggle} title={label} />
      <ActionIcon
        variant={variant}
        color={color}
        radius="lg"
        onClick={() => {
          toggle();
          console.log('Pressed button');
        }}
      >
        <Tooltip label={label} offset={10} position="left">
          <IconComponent style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </Tooltip>
      </ActionIcon>
    </>
  );
}

function GetActionIcon({ status }: { status: Perm['status'] }) {
  switch (status.toLowerCase()) {
    case 'passed':
      return (
        <>
          <GetActionButton actionType="view" />
        </>
      );
    case 'failed':
      // TODO: disable button if user is on cooldown
      return (
        <>
          <GetActionButton actionType="send" />
        </>
      );
    case 'pending':
      return (
        <>
          <GetActionButton actionType="edit" />
          <GetActionButton actionType="delete" />
        </>
      );
    case 'blacklisted':
      return <></>;
    case 'none':
    default:
      return (
        <>
          <GetActionButton actionType="send" />
        </>
      );
  }
}

function CreateRowData({ perms }: { perms: Perm[] }) {
  return perms.map(({ name, status, requiredHours, prereqs, strikes }) => (
    <Table.Tr key={name}>
      <Table.Td>{name}</Table.Td>
      <Table.Td>
        <Center>
          <Badge color={statusColors[status.toLowerCase()]} variant="filled">
            {status}
          </Badge>
        </Center>
      </Table.Td>
      <Table.Td>
        <Center>{requiredHours}</Center>
      </Table.Td>
      <Table.Td>
        <Center>
          <Group justify="center">
            <GetPrereqs prereqs={prereqs} />
          </Group>
        </Center>
      </Table.Td>
      <Table.Td>
        <Center>
          <GetStrikeBadges strikes={strikes} />
        </Center>
      </Table.Td>
      <Table.Td>
        <Group justify="center">
          <GetActionIcon status={status} />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));
}

function CreateTable({ name, perms }: { name: Perm['name']; perms: Perm[] }) {
  return (
    <Paper withBorder radius={20} m={20}>
      <Table.ScrollContainer minWidth={600} p={10}>
        <Center>
          <h2>{name}</h2>
        </Center>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Required Hours</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Prerequisites</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Strikes</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <CreateRowData perms={perms} />
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}

export function PermissionsTable() {
  return (
    <>
      <CreateTable name="Standard Permissions" perms={standardPerms} />
      <CreateTable name="Asset Permissions" perms={assetPerms} />
    </>
  );
}
