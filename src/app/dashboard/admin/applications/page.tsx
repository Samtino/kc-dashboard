'use client';

import { Accordion, Badge, Container, Group, Title } from '@mantine/core';
import { Application, Permission } from '@prisma/client';
import { useEffect, useState } from 'react';
import { getPermissionsData } from '@/src/app/services/permissions';
import { getPendingApplications } from '@/src/app/services/applications';
import { ViewExam } from '@/src/components/ViewExam/ViewExam';

export default function AdminApplicationsPage() {
  const [standardPermissions, setStandardPermissions] = useState<Permission[]>([]);
  const [assetPermissions, setAssetPermissions] = useState<Permission[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStandardPermissions(await getPermissionsData('standard'));
        setAssetPermissions(await getPermissionsData('asset_exam'));

        setApplications(await getPendingApplications());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Title order={1}>Loading...</Title>;
  }

  const permissions = [...standardPermissions, ...assetPermissions];

  return (
    <Container p={20} m={20} size="100%">
      <Accordion variant="contained" chevronPosition="left">
        {permissions?.map((perm) => {
          const apps = applications?.filter((app) => app.permission_id === perm.id);
          return (
            <Accordion.Item key={perm.id} value={perm.name}>
              <Accordion.Control disabled={apps.length === 0}>
                <Group wrap="nowrap" justify="space-between">
                  {perm.name} Applications
                  <Group>
                    <p>Pending Applications: </p>
                    <Badge color="blue">{apps.length}</Badge>
                  </Group>
                </Group>
              </Accordion.Control>

              <Accordion.Panel>
                {apps.map((app) => (
                  <div key={app.id}>
                    <ViewExam app={app} />
                  </div>
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Container>
  );
}
