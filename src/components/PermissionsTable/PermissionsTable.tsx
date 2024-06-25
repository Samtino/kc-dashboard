import {
  ActionIcon,
  Badge,
  Center,
  Group,
  Loader,
  Paper,
  rem,
  Table,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Application, Permission, Strike, User, UserPermission } from '@prisma/client';
import { IconZoom, IconPencil, IconSend, IconTrash, IconX } from '@tabler/icons-react';
import { ExamModal } from '../ExamModal/ExamModal';
import { getCurrentUser } from '@/src/app/services/user';
import {
  getPermissionsData,
  getUserApplications,
  getUserPermissions,
  getUserStrikes,
} from '@/src/app/services/permissions';
import { ExamForm } from '../ExamForm/ExamForm';

type UserData = {
  user: User;
  userPerms: UserPermission[];
  applications: Application[];
  strikes: Strike[];
};

type ActionType = 'view' | 'edit' | 'send' | 'delete' | 'denied';

const statusColors: Record<string, string> = {
  PASSED: 'green',
  FAILED: 'red',
  PENDING: 'yellow',
  BLACKLISTED: 'black',
  NONE: 'gray',
};

export function PermissionsTable() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [standardPerms, setStandardPerms] = useState<Permission[]>();
  const [assetPerms, setAssetPerms] = useState<Permission[]>();
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
          throw new Error('User not found');
        }

        setUser(currentUser);
        setStandardPerms(await getPermissionsData('standard'));
        setAssetPerms(await getPermissionsData('asset_exam'));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserPerms = async () => {
      if (user) {
        const [perms, applications, strikes] = await Promise.all([
          getUserPermissions(user.id),
          getUserApplications(user.id),
          getUserStrikes(user.id),
        ]);

        setUserData({ user, userPerms: perms, applications, strikes });
      }
    };

    fetchUserPerms();
  }, [user]);

  if (loading) {
    return (
      <Center>
        <Loader size="xl" />
      </Center>
    );
  }

  if (!assetPerms || !standardPerms || !userData) {
    return (
      <Center>
        <h1>Error loading permissions</h1>
      </Center>
    );
  }

  return (
    <>
      <CreateTable permsType="Standard Permissions" permsData={standardPerms} userData={userData} />
      <CreateTable permsType="Asset Permissions" permsData={assetPerms} userData={userData} />
    </>
  );
}

function CreateTable({
  permsType,
  permsData,
  userData,
}: {
  permsType: string;
  permsData: Permission[];
  userData: UserData;
}) {
  return (
    <Paper withBorder radius={20} m={20}>
      <Table.ScrollContainer minWidth={600} p={10}>
        <Center>
          <h2>{permsType}</h2>
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
            {permsData.map((perm) => (
              <CreateRowData key={perm.id} perm={perm} userData={userData} />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}

function CreateRowData({ perm, userData }: { perm: Permission; userData: UserData }) {
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
            <GetPrereqs prereqs={perm.prerequisites} status={status} />
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
            userData={userData.user}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}

function GetPrereqs({
  prereqs,
  status,
}: {
  prereqs: Permission['prerequisites'];
  status: Application['status'];
}) {
  if (!prereqs.length) {
    return (
      <Badge color="gray" variant="light">
        None
      </Badge>
    );
  }

  const color = status === 'PASSED' ? 'green' : 'red';

  return (
    <>
      {prereqs.map((item) => (
        <Badge key={item} color={color} variant="filled">
          {item}
        </Badge>
      ))}
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
}: {
  status: Application['status'];
  perm: Permission;
  userCooldown?: Application['next_apply_date'];
  userData: User;
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
    denied: { label: 'No SteamID', icon: IconX, color: 'red', variant: 'light' },
  };

  const actionTypes: Record<string, ActionType[]> = {
    PASSED: ['view'],
    FAILED: ['send'],
    PENDING: ['edit', 'delete'],
    BLACKLISTED: [],
    NONE: ['send'],
  };

  const actions = actionTypes[status.toUpperCase()] || ['send'];

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
}: {
  actionType: ActionType;
  perm: Permission;
  disabled?: boolean;
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
  };

  const action = actionConfig[actionType];
  if (!action) return null;

  const { icon: IconComponent, variant, color, label } = action;
  const [hidden, { toggle }] = useDisclosure();

  const title = `${perm.name} Exam`;
  return (
    <>
      <ExamModal hidden={hidden} toggle={toggle} title={title}>
        <ExamForm permId={perm.id} type={actionType} />
      </ExamModal>
      <ActionIcon variant={variant} color={color} radius="lg" onClick={toggle} disabled={disabled}>
        <Tooltip label={label} offset={10} position="left">
          <IconComponent style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </Tooltip>
      </ActionIcon>
    </>
  );
}
