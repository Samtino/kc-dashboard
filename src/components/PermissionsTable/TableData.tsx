import { ActionIcon, Badge, Center, Group, rem, Table, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Permission, Strike } from '@prisma/client';
import { IconPencil, IconSend, IconTrash, IconX, IconZoom } from '@tabler/icons-react';
import { ActionType, PermissionData, UserData } from '@/lib/types';
import { ExamModal } from '../ExamModal/ExamModal';
import { ExamForm } from '../ExamForm/ExamForm';

const statusColors: Record<string, string> = {
  PASSED: 'green',
  FAILED: 'red',
  PENDING: 'yellow',
  BLACKLISTED: 'black',
  NONE: 'gray',
};

export function TableData({
  permData,
  userData,
}: {
  permData: PermissionData;
  userData: UserData;
}) {
  const perm = permData.permission;
  const userApp = userData.applications.find((app) => app.permission_id === perm.id);
  const status = userApp?.status ?? 'NONE';
  const strikes = userData.strikes.filter((strike) => strike.permission_id === perm.id);

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
            <GetPrereqs prereqs={permData.prerequisites} userData={userData} />
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
            userCooldown={userApp?.next_apply_date ?? undefined}
            userData={userData}
            prereqs={permData.prerequisites}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}

function GetPrereqs({
  prereqs,
  userData,
}: {
  prereqs: PermissionData['prerequisites'];
  userData: UserData;
}) {
  if (prereqs.length === 0) {
    return <Badge color="gray">None</Badge>;
  }

  return (
    <>
      {prereqs.map((prereq) => {
        const hasPrereq = userData.permissions.some(
          (userPerm) => userPerm.permission_id === prereq.id
        );
        return (
          <Tooltip label={prereq.name} key={prereq.id}>
            <Badge color={hasPrereq ? 'green' : 'red'}>{prereq.name}</Badge>
          </Tooltip>
        );
      })}
    </>
  );
}

function GetStrikeBadges({ strikes }: { strikes: Strike[] }) {
  const warning = strikes.find((strike) => strike.type === 'WARNING');
  const strike1 = strikes.find((strike) => strike.type === 'STRIKE1');
  const strike2 = strikes.find((strike) => strike.type === 'STRIKE2');

  const strikeBadges = [
    { label: 'W', color: warning ? 'yellow' : 'gray' },
    { label: '1', color: strike1 ? 'red' : 'gray' },
    { label: '2', color: strike2 ? 'red' : 'gray' },
  ];

  return (
    <>
      {strikeBadges.map((badge, index) => (
        <Tooltip label={badge.label} key={index}>
          <Badge color={badge.color} m={6} circle>
            {badge.label}
          </Badge>
        </Tooltip>
      ))}
    </>
  );
}

function GetActionIcon({
  status,
  perm,
  userCooldown,
  userData,
  prereqs,
}: {
  status: string;
  perm: Permission;
  userCooldown: Date | undefined;
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
    PENDING: ['view', 'edit', 'delete'],
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
            userData={userData}
            // prereqs={prereqs}
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
  // prereqs,
}: {
  actionType: ActionType;
  perm: Permission;
  disabled?: boolean;
  userData: UserData;
  // prereqs: Permission[];
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
        <ExamForm permId={perm.id} type={actionType} userData={userData} />
      </ExamModal>
      <ActionIcon
        variant={variant}
        color={color}
        radius="lg"
        onClick={() => {
          switch (actionType) {
            case 'send':
            case 'view':
              toggle();
              // TODO: Implement view exam
              break;
            case 'edit':
              // TODO: Implement edit exam
              break;
            case 'delete':
              // TODO: Implement delete exam
              break;
          }
        }}
        disabled={disabled}
      >
        <Tooltip label={label} offset={10} position="left">
          <IconComponent style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </Tooltip>
      </ActionIcon>
    </>
  );
}
