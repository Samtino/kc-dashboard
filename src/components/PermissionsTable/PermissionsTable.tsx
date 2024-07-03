'use client';

import { Button, Center, Loader, Paper, Table } from '@mantine/core';
import { useState } from 'react';
import { updateUserCookie } from '@/src/services/user';
import { PermissionData, UserData } from '@/lib/types';
import { TableData } from './TableData';

export function PermissionsTable({
  permissions,
  userData,
}: {
  permissions: PermissionData[];
  userData: UserData;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async (data: UserData) => {
    setLoading(true);
    try {
      await updateUserCookie(data.user.discord_id).then(() => window.location.reload());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const standardPerms = permissions.filter((perm) => perm.permission.asset_exam === false);
  const assetPerms = permissions.filter((perm) => perm.permission.asset_exam === true);

  // FIXME: Replace with <Skeleton /> data loading component <Loading />
  if (loading) {
    return (
      <Center>
        <Loader size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <h1>{error}</h1>
      </Center>
    );
  }

  return (
    <>
      <Button onClick={() => refreshData(userData)}>Refresh Data</Button>
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
