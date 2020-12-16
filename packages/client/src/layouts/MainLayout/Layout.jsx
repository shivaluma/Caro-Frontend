import React from 'react';
import { UpdateProfileModal } from './components/User';
import Header from './components/Header';

const Layout = ({ children, leftHeader, rightHeader }) => {
  return (
    <main className="flex flex-col flex-1 flex-shrink-0 h-screen max-h-screen overflow-y-hidden">
      <Header leftChild={leftHeader} rightChild={rightHeader} />
      <UpdateProfileModal />
      <div className="scroll-children">{children}</div>
    </main>
  );
};

export default Layout;
