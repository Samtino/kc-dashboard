'use client';

import { Accordion, Badge, Container, Group, Pagination, Title } from '@mantine/core';
import { Application, Permission, User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { getPermissionsData } from '@/src/app/services/permissions';
import { getPendingApplications } from '@/src/app/services/applications';
import { ViewExam } from '@/src/components/ViewExam/ViewExam';

type AppState = {
  [key: string]: {
    activePage: number;
    total: number;
  };
};

export default function AdminApplicationsPage() {
  const [standardPermissions, setStandardPermissions] = useState<Permission[]>([]);
  const [assetPermissions, setAssetPermissions] = useState<Permission[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [appState, setAppState] = useState<AppState>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStandardPermissions = await getPermissionsData('standard');
        const fetchedAssetPermissions = await getPermissionsData('asset_exam');
        const fetchedApplications = await getPendingApplications();

        setStandardPermissions(fetchedStandardPermissions);
        setAssetPermissions(fetchedAssetPermissions);
        setApplications(fetchedApplications);

        // Initialize state for each permission with its applications count
        const initialState: AppState = {};
        const allPermissions = [...fetchedStandardPermissions, ...fetchedAssetPermissions];
        allPermissions.forEach((perm) => {
          const permApps = fetchedApplications.filter((app) => app.permission_id === perm.id);
          initialState[perm.id] = { activePage: 1, total: permApps.length };
        });
        setAppState(initialState);
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

  const handlePageChange = (permId: string, page: number) => {
    setAppState((prevState) => ({
      ...prevState,
      [permId]: {
        ...prevState[permId],
        activePage: page,
      },
    }));
  };

  const passButton = (app: Application, reviewer: User) => {
    // Mark the application as passed by the reviewer
  };

  return (
    <Container p={20} m={20} size="100%">
      <Accordion variant="contained" chevronPosition="left">
        {permissions.map((perm) => {
          const apps = applications.filter((app) => app.permission_id === perm.id);
          const { activePage, total } = appState[perm.id] || { activePage: 1, total: 0 };
          const activeApp = apps[activePage - 1];

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
                {activeApp && (
                  <div key={activeApp.id}>
                    <ViewExam app={activeApp} />
                  </div>
                )}
                <Group justify="space-between">
                  <Pagination
                    total={total}
                    value={activePage}
                    onChange={(page) => handlePageChange(perm.id, page)}
                  />
                </Group>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Container>
  );
}
