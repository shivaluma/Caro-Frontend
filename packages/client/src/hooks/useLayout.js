/* eslint-disable react/display-name */
import React, { memo } from 'react';
import { MainLayout } from 'layouts';

const useLayout = ({ left = () => null, right = () => null }) => {
  return memo(({ children }) => (
    <MainLayout leftHeader={left} rightHeader={right}>
      {children}
    </MainLayout>
  ));
};

export default useLayout;
