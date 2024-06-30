'use client';

// TODO: parallelize the fetching of user data and permissions data

import { Center, Loader, Paper, Table } from '@mantine/core';
import { useEffect, useState } from 'react';
// import { Permission } from '@prisma/client';
import { getCurrentUser } from '@/src/services/user';
// import {
//   getPermissionsData,
//   getUserApplications,
//   getUserPermissions,
//   getUserStrikes,
// } from '@/src/services/permissions';
import { PermissionData, UserData } from '@/lib/types';
import { TableData } from './TableData';
import { getPermissionData } from '@/src/services/permissions';

export function PermissionsTable() {
  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState(true);
  const [permissionsData, setPermissionsData] = useState<PermissionData[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
          throw new Error('User not found');
        }

        setUserData(currentUser);
        setPermissionsData(await getPermissionData());
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData, permissionsData]);

  const standardPerms = permissionsData?.filter((perm) => perm.permission.asset_exam === false);
  const assetPerms = permissionsData?.filter((perm) => perm.permission.asset_exam === true);

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
  permsData: PermissionData[];
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
              <TableData key={perm.id} permData={perm} userData={userData} />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}
