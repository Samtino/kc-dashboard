import { useEffect, useState } from 'react';
import { ActionIcon, Badge, Center, Group, rem, Table, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Application, Permission, Strike } from '@prisma/client';
import { IconPencil, IconSend, IconTrash, IconX, IconZoom } from '@tabler/icons-react';
import { ActionType, UserData } from '@/lib/types';
import { ExamModal } from '../ExamModal/ExamModal';
import { ExamForm } from '../ExamForm/ExamForm';
import { getPrerequisites } from '@/src/app/services/permissions';

const statusColors: Record<string, string> = {
  PASSED: 'green',
  FAILED: 'red',
  PENDING: 'yellow',
  BLACKLISTED: 'black',
  NONE: 'gray',
};

export function PermissionData({ perm, userData }: { perm: Permission; userData: UserData }) {
  const userApp = userData.applications.find((app) => app.permission_id === perm.id);
  const status = userApp?.status ?? 'NONE';
  const strikes = userData.strikes.filter((strike) => strike.permission_id === perm.id);
  const [prereqs, setPrereqs] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const prerequisites = await getPrerequisites(perm.id);
      if (prerequisites) {
        setPrereqs(prerequisites);
      }
    };

    fetchData();
  }, [perm.id]);

  return (
    <Table.Tr>
      <Table.Td>{perm.name}</Table.Td>
      <Table.Td>
        <Center>
          <Badge color={statusColors[status.toUpperCase()]} variant="filled">
            {status}
          </Badge>
        </Center>
      </Table.Td>
      <Table.Td>
        <Center>{perm.required_hours}</Center>
      </Table.Td>
      <Table.Td>
        <Center>
          <Group justify="center">
            <GetPrereqs prereqs={prereqs} userData={userData} />
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
          <GetActionIcon
            status={status}
            perm={perm}
            userCooldown={userApp?.next_apply_date}
            userData={userData}
            prereqs={prereqs}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}

function GetPrereqs({ prereqs, userData }: { prereqs: Permission[]; userData: UserData }) {
  if (!prereqs.length) {
    return (
      <Badge color="gray" variant="light">
        None
      </Badge>
    );
  }
  return (
    <>
      {prereqs.map((item) => {
        const color = userData.applications.some(
          (app) => app.permission_id === item.id && app.status === 'PASSED'
        )
          ? 'green'
          : 'red';
        return (
          <Badge key={item.id} color={color} variant="filled">
            {item.name}
          </Badge>
        );
      })}
    </>
  );
}

function GetStrikeBadges({ strikes }: { strikes: Strike[] }) {
  const strikeBadge = (strikeType: string, color: string, label: string) => (
    <Badge
      color={strikes.some((strike) => strike.type === strikeType) ? color : 'gray'}
      variant="filled"
      circle
    >
      {label}
    </Badge>
  );

  return (
    <Group justify="center">
      {strikeBadge('WARNING', 'yellow', 'W')}
      {strikeBadge('STRIKE1', 'red', 'S')}
      {strikeBadge('STRIKE2', 'red', 'S')}
    </Group>
  );
}

function GetActionIcon({
  status,
  perm,
  userCooldown,
  userData,
  prereqs,
}: {
  status: Application['status'];
  perm: Permission;
  userCooldown?: Application['next_apply_date'];
  userData: UserData;
  prereqs: Permission[];
}) {
  const onCooldown = userCooldown ? new Date(userCooldown) > new Date() : false;

  const actionConfig: Record<
    string,
    { label: string; icon: typeof IconZoom; color: string; variant: string; disabled?: boolean }
  > = {
    view: { label: 'View', icon: IconZoom, color: 'gray', variant: 'light' },
    edit: { label: 'Edit', icon: IconPencil, color: 'blue', variant: 'light' },
    send: { label: 'Send', icon: IconSend, color: 'green', variant: 'light', disabled: onCooldown },
    delete: { label: 'Delete', icon: IconTrash, color: 'red', variant: 'light' },
    denied: { label: 'No SteamID', icon: IconX, color: 'red', variant: 'light', disabled: true },
    prereqs: {
      label: 'Missing Prerequisites',
      icon: IconX,
      color: 'red',
      variant: 'light',
      disabled: true,
    },
  };

  const actionTypes: Record<string, ActionType[]> = {
    PASSED: ['view'],
    FAILED: ['send'],
    PENDING: ['edit', 'delete'],
    BLACKLISTED: [],
    NONE: ['send'],
    PREREQS: ['prereqs'],
  };

  let actions = actionTypes[status.toUpperCase()] || ['send'];
  const canApply = prereqs.every((prereq) =>
    userData.applications.some((app) => app.permission_id === prereq.id && app.status === 'PASSED')
  );

  if (!canApply) {
    actions = ['prereqs'];
  }

  return (
    <>
      {actions.map((actionType) => {
        const action = actionConfig[actionType];
        if (!action) return null;

        return (
          <GetActionButton
            key={actionType}
            actionType={actionType}
            perm={perm}
            disabled={action.disabled}
            userData={userData.user}
          />
        );
      })}
    </>
  );
}

function GetActionButton({
  actionType,
  perm,
  disabled,
  userData,
}: {
  actionType: ActionType;
  perm: Permission;
  disabled?: boolean;
  userData: UserData;
}) {
  const actionConfig: Record<
    string,
    { label: string; icon: typeof IconZoom; color: string; variant: string }
  > = {
    view: { label: 'View Last Exam', icon: IconZoom, color: 'gray', variant: 'light' },
    edit: { label: 'Edit Pending Exam', icon: IconPencil, color: 'blue', variant: 'light' },
    send: { label: 'Send New Exam', icon: IconSend, color: 'green', variant: 'light' },
    delete: { label: 'Delete Last Exam', icon: IconTrash, color: 'red', variant: 'light' },
    denied: { label: 'No SteamID', icon: IconX, color: 'red', variant: 'light' },
    prereqs: { label: 'Missing Prerequisites', icon: IconX, color: 'red', variant: 'light' },
  };

  const action = actionConfig[actionType];
  if (!action) return null;

  const { icon: IconComponent, variant, color, label } = action;
  const [hidden, { toggle }] = useDisclosure();

  const title = `${perm.name} Exam`;
  return (
    <>
      <ExamModal hidden={hidden} toggle={toggle} title={title}>
        <ExamForm permId={perm.id} type={actionType} user_id={userData.id} />
      </ExamModal>
      <ActionIcon variant={variant} color={color} radius="lg" onClick={toggle} disabled={disabled}>
        <Tooltip label={label} offset={10} position="left">
          <IconComponent style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </Tooltip>
      </ActionIcon>
    </>
  );
}
