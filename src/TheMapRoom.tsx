// TheMapRoom.tsx
import React, { Suspense, lazy } from 'react';
import BlackstarLoader from './BlackstarLoader';

const CesiumViewer = lazy(() => import('./CesiumViewer'));

const TheMapRoom: React.FC = () => {
  return (
    <Suspense fallback={<BlackstarLoader />}>
      <CesiumViewer />
    </Suspense>
  );
};

export default TheMapRoom;
