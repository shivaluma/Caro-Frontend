/* eslint-disable react/display-name */
import { useMemo, useCallback, useEffect, useState } from 'react';
import { useLayout } from 'hooks';

import { useSelector } from 'react-redux';
import socket from 'configs/socket';
import { RoomService } from 'services';
import { AddButton, GameButton } from './components';

const Main = () => {
  // const dispatch = useDispatch();
  const onlines = useSelector((state) => state.online);
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    (async () => {
      const rooms = await RoomService.getAllRooms();
      console.log(rooms);
      setRooms(rooms);
    })();

    socket.on('created-room-info', (data) => {
      console.log(data);
      setRooms((prev) => [...prev, data.room]);
    });

    socket.on('new-room', (data) => {
      setRooms((prev) => [...prev, data.room]);
    });
  }, []);

  const handleCreateNewRoom = useCallback(() => {
    socket.emit('create-room', 'gigi');
  }, []);
  const Layout = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLayout({
        left: () => (
          <div className="flex">
            <div key="leftHeader" className="ml-2 text-lg font-medium text-gray-800">
              Rooms <span className="text-lg">({rooms.length})</span>
            </div>
          </div>
        ),
        right: () => <AddButton handleClick={handleCreateNewRoom} />,
      }),
    [rooms.length, handleCreateNewRoom]
  );

  return (
    <Layout>
      <div className="container flex flex-col mx-auto mt-8">
        <div className="flex flex-wrap w-full mt-8 overflow-y-scroll room-container">
          {rooms?.length > 0 && rooms.map((room) => <GameButton key={room.roomId} room={room} />)}
        </div>
      </div>

      {/* <div className="flex flex-col">
        <h5>Who is online?</h5>
        <ul>
          {onlines.map((email) => (
            <li key={email}>{email}</li>
          ))}
        </ul>
      </div> */}

      <div className="hidden right-pane w-60 xl:block">
        <div className="flex flex-col mt-2">
          <span className="text-lg font-medium">{`Who is online (${onlines.length})`}</span>
          {onlines.map((online) => (
            <li key={online}>{online}</li>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Main;
