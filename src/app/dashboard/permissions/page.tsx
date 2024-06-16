'use client';

import { useState } from 'react';
import classes from './Permissions.module.css';
import { PermissionsTable } from '@/src/components/PermissionsTable/PermissionsTable';

// TODO: Add real data from the DB

export default function PermissionsPage() {
  // const [opened, setOpened] = useState(false);

  return (
    <div>
      {/* TODO: Re-implement the asset exams banner

      <Container hidden={opened} className={classes.notificationContainer}>
        <Notification
          title="Asset Exams Status"
          color={assetExams.color}
          onClick={() => setOpened(!opened)}
          classNames={{ closeButton: classes.closeButton }}
          m={20}
        >
          Asset exams are currently {assetExams.status ? 'open' : 'closed'}!
          <br />
          {assetExams.message}
        </Notification>
      </Container> */}

      <div>
        <h1>Permissions Overview</h1>
        <p>Work in progress!</p>
      </div>

      <br />

      <PermissionsTable />
    </div>
  );
}
