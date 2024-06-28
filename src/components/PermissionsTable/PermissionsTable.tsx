import { Center, Loader, Paper, Table } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Permission, User } from '@prisma/client';
import { getCurrentUser } from '@/src/services/user';
import {
  getPermissionsData,
  getUserApplications,
  getUserPermissions,
  getUserStrikes,
} from '@/src/services/permissions';
import { UserData } from '@/lib/types';
import { PermissionData } from './PermissionData';

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
        // eslint-disable-next-line no-console
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

        setUserData({ id: user.id, user, userPerms: perms, applications, strikes });
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
              <PermissionData key={perm.id} perm={perm} userData={userData} />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}
