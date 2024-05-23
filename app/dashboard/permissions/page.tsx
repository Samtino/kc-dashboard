'use client';

import { useState } from 'react';
import { Button, Container, Notification, Table, Tooltip } from '@mantine/core';
import type { User, Permission, Permissions } from '@/app/lib/types';
import classes from './Permissions.module.css';

function PermissionStatus({ permission }: { permission: Permission }) {
  const { type, reviewer, reason, reapplyDate } = permission.status;
  let { color, tooltipLabel, buttonLabel, disabled } = {
    color: 'gray',
    tooltipLabel: '',
    buttonLabel: '',
    disabled: false,
  };

  // FIXME: Implement the rest of the status types
  switch (type) {
    case 'passed':
      color = 'green';
      buttonLabel = 'Passed';
      tooltipLabel = `Passed by ${reviewer?.name}`;
      break;
    case 'failed':
      color = 'red';
      buttonLabel = 'Failed';
      tooltipLabel = 'You can reapply now!';
      if ((reapplyDate || 0) > new Date(Date.now())) {
        disabled = true;
        tooltipLabel = `Failed for ${reason}. You can reapply at: ${reapplyDate?.toLocaleString()}`;
      }
      break;
    case 'pending':
      break;
    case 'blacklisted':
      color = 'black';
      buttonLabel = 'Blacklisted';
      disabled = true;
      break;
    default:
      color = 'gray';
      buttonLabel = 'N/A';
      break;
  }

  return (
    <Tooltip label={tooltipLabel} miw={40} maw={360} multiline disabled={tooltipLabel === ''}>
      <Button disabled={disabled} color={color} w={120}>
        {buttonLabel}
      </Button>
    </Tooltip>
  );
}

export default function Permissions() {
  const [opened, setOpened] = useState(false);

  const placeholder: Permission[] = [
    {
      id: 1,
      name: 'Company Commander',
      callSign: '6-6',
      requiredHours: 100,
      assetPerm: false,
      status: {
        type: 'passed',
        reviewer: {
          id: '1234',
          name: 'Reviewer Name',
          avatar: 'https://cdn.discordapp.com/avatars/1234/1234.png',
        },
      },
    },
    {
      id: 2,
      name: 'Platoon Leader',
      callSign: '1-6',
      requiredHours: 50,
      assetPerm: false,
      status: {
        type: 'failed',
        reviewer: {
          id: '1234',
          name: 'Reviewer Name',
          avatar: 'https://cdn.discordapp.com/avatars/1234/1234.png',
        },
        reason: 'Reason for failure',
        reapplyDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    },
    {
      id: 3,
      name: 'Platoon TACP',
      callSign: '1-8',
      requiredHours: 100,
      assetPerm: true,
      status: {
        type: 'blacklisted',
        reviewer: {
          id: '1234',
          name: 'Reviewer Name',
          avatar: 'https://cdn.discordapp.com/avatars/1234/1234.png',
        },
      },
    },
  ];

  const assetExams: {
    status: boolean;
    end: Date;
    color: string | undefined;
    message: string | undefined;
    dateString: string | undefined;
  } = {
    status: false,
    end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    color: undefined,
    message: undefined,
    dateString: undefined,
  };

  if (assetExams.status) {
    assetExams.dateString = `${assetExams.end.toLocaleDateString()} at ${assetExams.end.toLocaleTimeString()}`;
    assetExams.color = 'green';
    assetExams.message = `They close at: ${assetExams.dateString}.`;
  } else {
    assetExams.color = 'red';
    assetExams.message = 'Please wait for the next asset exams cycle to apply.';
  }

  return (
    <div style={{ position: 'relative' }}>
      <Container hidden={opened} w={400} className={classes.notificationContainer}>
        <Notification
          title="Asset Exams Status"
          color={assetExams.color}
          onClick={() => setOpened(!opened)}
        >
          Asset exams are currently {assetExams.status ? 'open' : 'closed'}!
          <br />
          {assetExams.message}
        </Notification>
      </Container>

      <br />

      <div>
        <h1>Permissions Overview</h1>
        <p>Work in progress!</p>
      </div>

      <br />

      <Container size="lg" h="100%">
        <Table className={classes.table} striped highlightOnHover>
          <thead>
            <tr>
              <th>Permission</th>
              <th>Required Hours</th>
              <th>Obtained</th>
            </tr>
          </thead>
          <tbody>
            {placeholder.map((permission) => (
              <tr key={permission.id}>
                <td width={200}>{permission.name}</td>
                <td width={40}>{permission.requiredHours}</td>
                <td width={200}>
                  <PermissionStatus permission={permission} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}
