import { Suspense, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import { Spin } from 'antd';

const Auth = ({ route }) => {
  return (
    <div className="flex justify-center w-full mt-40 aligns-center">
      <Suspense fallback={<Spin />}>{renderRoutes(route.routes)}</Suspense>
    </div>
  );
};

export default Auth;
