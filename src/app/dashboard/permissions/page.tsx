import { PermissionsTable } from '@/src/components/PermissionsTable/PermissionsTable';
import AssetCycleNotification from './AssetCycleNotif';
import { getPermissionData } from '@/src/services/permissions';
import { getCurrentUser, getUserData } from '@/src/services/user';

export const metadata = {
  title: 'KC Dashboard - Permissions',
};

export default async function PermissionsPage() {
  /*
  TODO: Move the asset exams banner either to a header or a separate component
  TODO: Re-implement the PermissionsTable component as server-side rendered content
  TODO: Optimize the PermissionsTable for performance (faster rendering, less data fetching, etc.)
  */

  // const assetExams = {
  //   status: false,
  //   endDate: new Date('2024-06-20'),
  //   color: 'red',
  // };

  const permissions = await getPermissionData();
  const currentUser = await getCurrentUser();
  const userData = await getUserData(currentUser.user.discord_id);

  return (
    <div>
      <AssetCycleNotification />

      <div>
        <h1>Permissions Overview</h1>
        <p>Work in progress!</p>
      </div>

      <br />

      <PermissionsTable permissions={permissions} userData={userData} />
    </div>
  );
}
