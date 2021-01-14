/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/display-name */
import { useMemo, useCallback, useEffect, useState } from 'react';
import { useLayout } from 'hooks';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import socket from 'configs/socket';
import { RoomService, UserService } from 'services';
import clsx from 'clsx';
import { FaTrophy } from 'react-icons/fa';
import { Spin, Modal, Avatar, Select, Button } from 'antd';
import { ImTrophy } from 'react-icons/im';
import { ImCancelCircle } from 'react-icons/im';
import { AddButton, GameButton } from './components';

const { Option } = Select;
const Main = (props) => {
  // const dispatch = useDispatch();
  const onlines = useSelector((state) => state.online);
  const user = useSelector((state) => state.user);
  const [rooms, setRooms] = useState([]);
  const [leaderboards, setLeaderboards] = useState(null);
  const [modalData, setModalData] = useState({ show: false, player: null });
  const [newRoomData, setNewRoomData] = useState({ password: '', time: 30 });
  const [newRoomModalShow, setNewRoomModalShow] = useState(false);
  const [findMode, setFindMode] = useState(false);

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

    socket.on('clear-room', (roomId) => {
      setRooms((prev) => prev.filter((el, index) => index !== roomId));
    });

    return () => {
      socket.off('new-room');
      socket.off('game-invite');
      socket.off('clear-room');
    };
  }, [props.history]);

  useEffect(() => {
    if (!history) return;
    socket.on('created-room-info', (data) => {
      history.push(`/${data.room.roomId}`);
    });
  }, [history]);

  const handleOpenCreateRoomModal = useCallback(() => {
    setNewRoomModalShow(true);
    // socket.emit('create-room', { user });
  }, []);

  const handleCreateNewRoom = useCallback(() => {
    socket.emit('create-room', { user, option: newRoomData });
  }, [newRoomData, user]);

  const handleRoomClick = useCallback(
    (roomId) => {
      if (user.room) {
        history.push(`/${user.room}`);
        return;
      }
      history.push(`/${roomId}`);
    },
    [history, user]
  );

  console.log(modalData);

  const handleUserClick = (user) => {
    setModalData(() => ({ show: true, player: user }));
  };

  const handleHideModal = useCallback(() => {
    setModalData(() => ({ show: false }));
  }, []);

  const handleHideCreateRoomModal = useCallback(() => {
    setNewRoomModalShow(false);
  }, []);

  const handleRedirectToProfile = useCallback(() => {
    props.history.push(`/profile/${modalData.player._id}`);
  }, [props.history, modalData?.player?._id]);

  const handleChangeFieldRoomData = (field, value) => {
    setNewRoomData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuickMatch = useCallback(() => {
    setFindMode(true);
    socket.emit('quick-match', { user, option: { password: '', time: 30 } });
    socket.on('quick-match-cli', ({ roomId, users }) => {
      users.forEach((element) => {
        if (element._id === user._id) {
          if (roomId != null) {
            history.push(`/${roomId}`);
          }
        }
      });
    });
  }, [user, history]);

  const handleCancelFindMatch = useCallback(() => {
    socket.emit('cancel-quick-match', { user });
    socket.off('quick-match-cli');
    setFindMode(false);
  }, [user]);

  const Layout = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLayout({
        left: () => (
          <div className="flex">
            <div key="leftHeader" className="ml-2 text-xl font-medium text-gray-800">
              Rooms <span className="text-xl">({rooms.length})</span>
            </div>
          </div>
        ),
        right: () => (
          <>
            <Button
              onClick={findMode ? handleCancelFindMatch : handleQuickMatch}
              type="button"
              disabled={Number.isInteger(user?.room)}
              className="flex flex-row items-center p-2 px-3 py-4 mr-2 font-semibold border-2 rounded-full text-main border-main focus:outline-none">
              {findMode ? 'Finding Match' : 'Quick Match'}
              {findMode && <Spin size="small" className="ml-1 mr-2 -mb-1" />}
              {findMode && <ImCancelCircle />}
            </Button>

            <AddButton handleClick={handleOpenCreateRoomModal} />
          </>
        )
      }),
    [
      rooms.length,
      handleOpenCreateRoomModal,
      handleQuickMatch,
      handleCancelFindMatch,
      findMode,
      user?.room
    ]
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
                <li
                  className="p-2 mb-2 list-none bg-gray-200 rounded-md"
                  onClick={() => handleUserClick(online)}
                  key={online._id}>
                  {online.email}
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
                            'p-2 mb-2 text-white bg-gray-600 list-none rounded-md flex items-center hover:bg-gray-500'
                          )}
                          onClick={() => handleUserClick(user)}
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

      <Modal
        title="Create New Room"
        visible={newRoomModalShow}
        onOk={handleCreateNewRoom}
        okText="Create Room"
        onCancel={handleHideCreateRoomModal}>
        <div className="flex flex-col p-2">
          <span className="text-sm font-semibold">Password</span>
          <input
            value={newRoomData.password}
            onChange={(event) => handleChangeFieldRoomData('password', event.target.value)}
            className="px-3 py-2 mt-1 border rounded-md focus:outline-none"
            placeholder="Leave blank for open room"
          />

          <span className="mt-5 text-sm font-semibold">Time for a turn (second)</span>
          <Select
            value={newRoomData.time}
            className="w-full mt-1"
            onChange={(value) => handleChangeFieldRoomData('time', value)}>
            <Option value="5">5</Option>
            <Option value="10">10</Option>
            <Option value="10">15</Option>
            <Option value="20">20</Option>
            <Option value="30">30</Option>
            <Option value="40">40</Option>
            <Option value="50">50</Option>
            <Option value="60">60</Option>
          </Select>
        </div>
      </Modal>

      <Modal
        title={modalData?.player?.email}
        visible={modalData.show}
        onOk={handleRedirectToProfile}
        okText="View full profile"
        onCancel={handleHideModal}>
        <div className="flex flex-col items-center justify-center">
          <Avatar
            size={64}
            src="https://cdn.dribbble.com/users/4557429/avatars/small/open-uri20191213-19471-145569c?1576296398"
          />

          <div className="flex text-xs font-semibold">
            <span className="text-green-600">{modalData?.player?.wincount || 0}W</span>
            <span className="ml-3 text-gray-600">{modalData?.player?.drawcount || 0}D</span>
            <span className="ml-3 text-red-600">{modalData?.player?.losecount || 0}L</span>
          </div>
          <span className="flex items-center mt-2 text-xs text-yellow-600">
            {modalData?.player?.point || 0}
            <ImTrophy className="ml-1" />
          </span>
        </div>
      </Modal>
    </Layout>
  );
};

export default Main;
