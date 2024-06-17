'use client';

import { useState } from 'react';
import { Code, Container, Notification } from '@mantine/core';
import { PermissionsTable } from '@/src/components/PermissionsTable/PermissionsTable';
import classes from './Permissions.module.css';

// TODO: Add real data from the DB
export default function PermissionsPage() {
  const [bannerOpened, setBannerOpened] = useState(false);

  // TODO: move this to the PermissionsTable and display over the table as a banner
  const assetExams = {
    status: false,
    endDate: new Date('2024-06-20'),
    color: 'red',
  };

  return (
    <div>
      <Container hidden={bannerOpened} className={classes.notificationContainer}>
        <Notification
          title="Asset Exams Status"
          color={assetExams.color}
          onClick={() => setBannerOpened(!bannerOpened)}
          classNames={{ closeButton: classes.closeButton }}
          m={20}
        >
          Asset exams are currently <Code>{assetExams.status ? 'open' : 'closed'}</Code>!
          <br />
          They close at <Code>{assetExams.endDate.toLocaleString()}</Code>
        </Notification>
      </Container>

      <div>
        <h1>Permissions Overview</h1>
        <p>Work in progress!</p>
      </div>

      <br />

      <PermissionsTable />
    </div>
  );
}
