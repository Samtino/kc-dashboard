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
import { Icon, IconPencil, IconSend, IconTrash, IconZoom } from '@tabler/icons-react';
import { ExamModal } from '../ExamModal/ExamModal';
import { getCurrentUser } from '@/src/app/services/user';
import {
  getPermissionsData,
  getUserApplications,
  getUserPermissions,
  getUserStrikes,
} from '@/src/app/services/permissions';
import { ExamForm } from '../ExamForm/ExamForm';

type userData = {
  userPerms: UserPermission[];
  applications: Application[];
  strikes: Strike[];
};

const statusColors: Record<string, string> = {
  passed: 'green',
  failed: 'red',
  pending: 'yellow',
  blacklisted: 'black',
  none: 'gray',
};

export function PermissionsTable() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  const [standardPerms, setStandardPerms] = useState<Permission[]>();
  const [assetPerms, setAssetPerms] = useState<Permission[]>();
  const [userData, setUserData] = useState<userData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }

        setStandardPerms(await getPermissionsData('standard'));
        setAssetPerms(await getPermissionsData('asset_exam'));
      } catch (e: any) {
        // setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserPerms = async () => {
      if (user) {
        const perms = await getUserPermissions(user.id);
        const applications = await getUserApplications(user.id);
        const strikes = await getUserStrikes(user.id);

        const data = {
          userPerms: perms,
          applications,
          strikes,
        };

        setUserData(data);
      }
    };

    fetchUserPerms();
  });

  if (loading) {
    // TODO: add skeleton loader
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
  userData: userData;
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
            <CreateRowData permsData={permsData} userData={userData} />
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}

function CreateRowData({ permsData, userData }: { permsData: Permission[]; userData: userData }) {
  return permsData.map((perm) => {
    // const userPerm = userData.userPerms.find(
    //   (curUserPerm) => curUserPerm.permission_id === perm.id
    // );

    const userApp = userData.applications.find((app) => app.permission_id === perm.id);
    const status = userApp?.status ?? 'NONE';

    const strikes = userData.strikes.filter((strike) => strike.permission_id === perm.id);
    return (
      <Table.Tr key={perm.id}>
        <Table.Td>{perm.name}</Table.Td>
        <Table.Td>
          <Center>
            <Badge color={statusColors[status.toLowerCase()]} variant="filled">
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
              permName={perm.name}
              userCooldown={userApp?.next_apply_date}
            />
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });
}

// Prerequisites
function GetPrereqs({
  prereqs,
  status,
}: {
  prereqs: Permission['prerequisites'];
  status: Application['status'];
}) {
  if (prereqs.length === 0 || !prereqs) {
    return (
      <Badge color="gray" variant="light">
        None
      </Badge>
    );
  }

  const color = status === 'PASSED' ? 'green' : 'red';

  return prereqs.map((item) => (
    <Badge key={item} color={color} variant="filled">
      {item}
    </Badge>
  ));
}

// Strikes
function GetStrikeBadges({ strikes }: { strikes: Strike[] }) {
  const warningBadge = (
    <Badge
      color={strikes.find((strike) => strike.type === 'WARNING') ? 'yellow' : 'gray'}
      variant="filled"
      circle
    >
      W
    </Badge>
  );
  const strike1Badge = (
    <Badge
      color={strikes.find((strike) => strike.type === 'STRIKE1') ? 'red' : 'gray'}
      variant="filled"
      circle
    >
      S
    </Badge>
  );
  const strike2Badge = (
    <Badge
      color={strikes.find((strike) => strike.type === 'STRIKE2') ? 'red' : 'gray'}
      variant="filled"
      circle
    >
      S
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

// Action buttons
function GetActionIcon({
  status,
  permName,
  userCooldown,
}: {
  status: Application['status'];
  permName: string;
  userCooldown?: Application['next_apply_date'];
}) {
  const canApply = userCooldown ? new Date(userCooldown) < new Date() : true;

  switch (status.toLowerCase()) {
    case 'passed':
      return (
        <>
          <GetActionButton actionType="view" permName={permName} />
        </>
      );
    case 'failed':
      return (
        <>
          <GetActionButton actionType="send" permName={permName} disabled={canApply} />
        </>
      );
    case 'pending':
      return (
        <>
          <GetActionButton actionType="edit" permName={permName} />
          <GetActionButton actionType="delete" permName={permName} />
        </>
      );
    case 'blacklisted':
      return <></>;
    case 'none':
    default:
      return (
        <>
          <GetActionButton actionType="send" permName={permName} />
        </>
      );
  }
}

function GetActionButton({
  actionType,
  permName,
  disabled,
}: {
  actionType: string;
  permName: Permission['name'];
  disabled?: boolean;
}) {
  const actionConfig: Record<
    string,
    { label: string; icon: Icon; color: string; variant: string }
  > = {
    view: { label: 'View', icon: IconZoom, color: 'gray', variant: 'light' },
    edit: { label: 'Edit', icon: IconPencil, color: 'blue', variant: 'light' },
    send: { label: 'Send', icon: IconSend, color: 'green', variant: 'light' },
    delete: { label: 'Delete', icon: IconTrash, color: 'red', variant: 'light' },
  };

  const action = actionConfig[actionType];
  if (!action) return null;

  const { icon: IconComponent, variant, color, label } = action;
  const [hidden, { toggle }] = useDisclosure();

  // FIXME: add exam type to modal popup

  const title = `${label} ${permName} Exam`;
  return (
    <>
      <ExamModal hidden={hidden} toggle={toggle} title={title}>
        <ExamForm type={permName} />
      </ExamModal>
      <ActionIcon
        variant={variant}
        color={color}
        radioGroup="lg"
        onClick={toggle}
        disabled={disabled}
      >
        <Tooltip label={label} offset={10} position="left">
          <IconComponent style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </Tooltip>
      </ActionIcon>
    </>
  );
}
