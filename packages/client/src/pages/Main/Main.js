/* eslint-disable react/display-name */
import { useMemo } from 'react';
import { useLayout } from 'hooks';
import socket from 'configs/socket';

const Main = () => {
  const Layout = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLayout({
        left: () => (
          <div key="leftHeader" className="ml-2 text-xl font-medium text-gray-800">
            Rooms
          </div>
        ),
      }),
    []
  );

  return (
    <Layout>
      <button
        onClick={() => {
          console.log('emit socket click');
          socket.emit('kaka', { message: 'hihi' });
        }}
        type="button">
        asd
      </button>
    </Layout>
  );
};

export default Main;
