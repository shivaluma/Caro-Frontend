/* eslint-disable react/display-name */
import { useMemo, useCallback, useEffect, useState } from 'react';
import { useLayout } from 'hooks';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import socket from 'configs/socket';
import { RoomService, UserService } from 'services';
import clsx from 'clsx';
import { FaTrophy } from 'react-icons/fa';
import { Spin } from 'antd';
import { AddButton, GameButton } from './components';

const Main = () => {
  // const dispatch = useDispatch();
  const onlines = useSelector((state) => state.online);
  const user = useSelector((state) => state.user);
  const [rooms, setRooms] = useState([]);
  const [leaderboards, setLeaderboards] = useState(null);
  const history = useHistory();
  useEffect(() => {
    (async () => {
      const rooms = await RoomService.getAllRooms();
      setRooms(rooms);

      const leaderboards = await UserService.getLeaderboards();
      setLeaderboards(leaderboards);
    })();

    socket.on('new-room', (data) => {
      setRooms((prev) => [...prev, data.room]);
    });
  }, []);

  useEffect(() => {
    if (!history) return;
    socket.on('created-room-info', (data) => {
      history.push(`/${data.room.roomId}`);
    });
  }, [history]);

  const handleCreateNewRoom = useCallback(() => {
    socket.emit('create-room', { _id: user._id });
  }, [user]);

  const handleRoomClick = useCallback(
    (roomId) => {
      history.push(`/${roomId}`);
    },
    [history]
  );
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
        right: () => <AddButton handleClick={handleCreateNewRoom} />
      }),
    [rooms.length, handleCreateNewRoom]
  );

  return (
    <Layout>
      <div className="flex flex-1 w-full h-full">
        <div className="container flex flex-col mx-auto">
          <div className="flex flex-wrap w-full mt-8 overflow-y-scroll room-container">
            {rooms?.length > 0 &&
              rooms.map((room) => (
                <GameButton key={room.roomId} onClick={handleRoomClick} room={room} />
              ))}
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

        <div className="flex-col hidden h-full max-h-full pt-2 border-l w-72 xl:flex">
          <div className="flex-1 p-2 -mb-12">
            <div className="flex flex-col">
              <span className="text-lg font-medium">{`Who Is Online (${onlines.length})`}</span>
              {onlines.map((online) => (
                <li className="p-2 list-none bg-gray-200 rounded-md" key={online}>
                  {online}
                </li>
              ))}
            </div>
          </div>
          <div className="flex-1 p-2 border-t">
            <div className="flex flex-col h-full">
              <span className="mb-1 text-lg font-medium text-center">Leaderboards</span>
              <div className="relative w-full h-full">
                <div className="absolute top-0 bottom-0 left-0 right-0 overflow-y-auto">
                  <Spin spinning={leaderboards === null}>
                    {leaderboards &&
                      leaderboards.map((user, index) => (
                        <li
                          className={clsx(
                            'p-2 mb-2 text-white bg-gray-600 list-none rounded-md flex items-center'
                          )}
                          key={user._id}>
                          {index < 3 && (
                            <FaTrophy
                              className={clsx(
                                index === 0 && 'text-yellow-400 w-8',
                                index === 1 && 'text-gray-200 w-8',
                                index === 2 && 'text-yellow-600 w-8'
                              )}
                            />
                          )}{' '}
                          {index >= 3 && (
                            <span className="w-8 text-center trunacte">{`#${index + 1}`}</span>
                          )}{' '}
                          {user.email}
                        </li>
                      ))}
                  </Spin>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Main;
