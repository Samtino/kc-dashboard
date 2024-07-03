'use client';

import { Accordion, Badge, Container, Group, Pagination, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getPendingApplications } from '@/src/services/applications';
import { ViewExam } from '@/src/components/ViewExam/ViewExam';
import { getPermissionData } from '@/src/services/permissions';
import { ApplicationData, PermissionData } from '@/lib/types';

type AppState = {
  [key: string]: {
    activePage: number;
    total: number;
  };
};

export default function AdminApplicationsPage() {
  const [permissions, setPermissions] = useState<PermissionData[]>([]);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [appState, setAppState] = useState<AppState>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPermissions = await getPermissionData();
        const fetchedApplications = await getPendingApplications();

        setPermissions(fetchedPermissions);
        setApplications(fetchedApplications);

        // Initialize state for each permission with its applications count
        const initialState: AppState = {};
        fetchedPermissions.forEach((perm) => {
          const permApps = fetchedApplications.filter((app) => app.id === perm.id);
          initialState[perm.id] = { activePage: 1, total: permApps.length };
        });
        setAppState(initialState);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applications, permissions]);

  if (loading) {
    return <Title order={1}>Loading...</Title>;
  }
  const handlePageChange = (permId: string, page: number) => {
    setAppState((prevState) => ({
      ...prevState,
      [permId]: {
        ...prevState[permId],
        activePage: page,
      },
    }));
  };

  // TODO: Implement pass and fail buttons
  // const passButton = (app: Application, reviewer: User) => {
  //   // Mark the application as passed by the reviewer
  // };

  return (
    <Container p={20} m={20} size="100%">
      <Accordion variant="contained" chevronPosition="left">
        {permissions.map((perm) => {
          const apps = applications.filter((app) => app.id === perm.id);
          const { activePage, total } = appState[perm.id] || { activePage: 1, total: 0 };
          const activeApp = apps[activePage - 1];

          return (
            <Accordion.Item key={perm.id} value={perm.permission.name}>
              <Accordion.Control disabled={apps.length === 0}>
                <Group wrap="nowrap" justify="space-between">
                  {perm.permission.name} Applications
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
