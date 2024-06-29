'use client';

import { useState } from 'react';
import { Code, Container, Notification } from '@mantine/core';

export default function AssetCycleNotification() {
  const [bannerOpened, setBannerOpened] = useState(false);

  // TODO: Pull this information from the database
  const assetExams = {
    status: false,
    endDate: new Date('2024-06-20'),
    color: 'red',
  };

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
      <Container hidden={bannerOpened} style={{ marginBottom: '20px' }}>
        <Notification
          title="Asset Exams Status"
          color={assetExams.color}
          onClick={() => setBannerOpened(!bannerOpened)}
          closeButtonProps={{ style: { color: 'white' } }}
          style={{ margin: '20px' }}
        >
          Asset exams are currently <Code>{assetExams.status ? 'open' : 'closed'}</Code>!
          <br />
          They close at <Code>{assetExams.endDate.toLocaleString()}</Code>
        </Notification>
      </Container>
    </div>
  );
}
