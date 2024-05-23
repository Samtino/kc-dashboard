'use client';

import { useState } from 'react';
import { Button, Code, Container, Notification, Table, Tooltip } from '@mantine/core';
import type { permission, User } from '@/lib/types';
import classes from './Permissions.module.css';

function PermissionStatus({
  permission,
  examStatus,
}: {
  permission: permission;
  examStatus: boolean;
}) {
  const { type, reviewer, reason, reapplyDate } = permission.status || {};
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
      color = 'yellow';
      buttonLabel = 'Pending';
      tooltipLabel = 'You currently have a pending application.'; // TODO: Add way to cancel application
      disabled = true;
      break;
    case 'blacklisted':
      color = 'black';
      buttonLabel = 'Blacklisted';
      disabled = true;
      break;
    default:
      color = 'gray';
      buttonLabel = 'N/A';
      if (!permission.assetPerm) {
        tooltipLabel = 'You have not applied for this permission yet.';
      }
      break;
  }

  if (permission.assetPerm && !examStatus && type !== 'pending' && type !== 'passed') {
    disabled = true;
    tooltipLabel = `Asset exams are close. ${tooltipLabel}`;
  }

  return (
    <Tooltip label={tooltipLabel} miw={40} maw={360} multiline disabled={tooltipLabel === ''}>
      <Button disabled={disabled} color={color} fullWidth>
        {buttonLabel}
      </Button>
    </Tooltip>
  );
}

export default function PermissionsPage() {
  const [opened, setOpened] = useState(false);
  class Permission implements permission {
    constructor(
      public id: number,
      public name: string,
      public requiredHours: 0 | 50 | 100,
      public assetPerm: boolean,
      public callSign?: string,
      public requiredPerms?: number[]
    ) {}
  }

  const placeholder: permission[] = [
    new Permission(1, 'Company Commander', 100, false, '6-6'),
    new Permission(2, 'Platoon Leader', 50, false, '1-6'),
    new Permission(3, 'Platoon TACP', 100, true),
    new Permission(4, 'Platoon Medic', 50, false, '1-9'),
    new Permission(5, 'Squad Leader / Support Team Leader', 50, false),
    new Permission(6, 'Banshee', 50, true, undefined, [4]),
    new Permission(7, 'Butcher', 50, true),
    new Permission(8, 'Phantom', 100, true, undefined, [2, 3]),
    new Permission(9, 'Rotary Logistics', 50, true, 'Stalker / Chevy'),
    new Permission(10, 'Rotary CAS', 50, true, 'Demon', [9]),
    new Permission(11, 'Fixed Wing CAS', 50, true, 'Reaper', [9]),
  ];

  // 24/7 Perms
  placeholder[0] = {
    ...placeholder[0],
    status: {
      type: 'passed',
      reviewer: {
        id: '1234',
        name: 'Reviewer Name',
        avatar: 'https://cdn.discordapp.com/avatars/1234/1234.png',
      },
    },
  };
  placeholder[1] = {
    ...placeholder[1],
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
  };
  placeholder[2] = {
    ...placeholder[2],
    status: {
      type: 'pending',
    },
  };
  placeholder[3] = {
    ...placeholder[3],
    status: {
      type: 'blacklisted',
      reason: 'Reason for blacklisting',
    },
  };

  // Asset Perms
  placeholder[5] = {
    ...placeholder[5],
    status: {
      type: 'passed',
      reviewer: {
        id: '1234',
        name: 'Reviewer Name',
        avatar: 'https://cdn.discordapp.com/avatars/1234/1234.png',
      },
    },
  };
  placeholder[6] = {
    ...placeholder[6],
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
  };
  placeholder[7] = {
    ...placeholder[7],
    status: {
      type: 'pending',
    },
  };
  placeholder[8] = {
    ...placeholder[8],
    status: {
      type: 'blacklisted',
      reason: 'Reason for blacklisting',
    },
  };

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
            {placeholder.map((permission: permission) => (
              <tr key={permission.id}>
                <td width={200}>{permission.name}</td>
                <td width={20}>
                  <Code>{permission.requiredHours}</Code>
                </td>
                <td width={200}>
                  <PermissionStatus permission={permission} examStatus={assetExams.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}
