'use server';

import { PermissionsTable } from '@/src/components/PermissionsTable/PermissionsTable';
import AssetCycleNotification from './AssetCycleNotif';

export default async function PermissionsPage() {
  // TODO: move this to the PermissionsTable and display over the table as a banner
  const assetExams = {
    status: false,
    endDate: new Date('2024-06-20'),
    color: 'red',
  };

  return (
    <div>
      <AssetCycleNotification />

      <div>
        <h1>Permissions Overview</h1>
        <p>Work in progress!</p>
      </div>

      <br />

      <PermissionsTable />
    </div>
  );
}
