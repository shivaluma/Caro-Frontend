/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/display-name */
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useLayout } from 'hooks';
import { Spin } from 'antd';
import { RoomService } from 'services';
import { AiOutlineFlag } from 'react-icons/ai';
import { FaHandshake } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import socket from 'configs/socket';
import { Modal, Tabs } from 'antd';
import calculateWin from 'utils/calculateWin';
import { Select, Input } from 'antd';
import { useForm } from 'react-hook-form';
import { changeRoom } from 'slices/user';
import { postCheckPassword } from 'services/room';
import { useDebounce } from 'hooks';
import clsx from 'clsx';
import { Chat, UserPlay, Board } from './components';

const { Option } = Select;

const { TabPane } = Tabs;
const Match = ({ match, history, location }) => {
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const messageRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [chat, setChat] = useState([]);
  const [gameData, setGameData] = useState({
    board: null,
    pos: null,
    move: []
  });

  const user = useSelector((state) => state.user);

  const [currentTab, setCurrentTab] = useState('1');
  const Layout = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLayout({
        left: () => (
          <div key="leftHeader" className="ml-2 text-xl font-medium text-gray-800">
            {match.params.id !== null && `Match #${match.params.id}`}
          </div>
        )
      }),
    [match.params.id]
  );

  useEffect(() => {
    const roomIdNum = Number(match.params.id);
    if (!Number.isInteger(roomIdNum) || roomIdNum < 0 || roomIdNum >= 20) {
      return;
    }
    (async () => {
      const room = await RoomService.getRoomById(roomIdNum, 'public');
      if (!room.data) {
        history.replace('/');
      }

      setRoom(() => {
        return room.data;
      });

      setChat(room?.data?.chats.length > 0 ? room?.data?.chats : [...initChat]);

      const next = room?.data?.next != null ? !room.data.next : true;

      setGameData((prev) => ({
        ...prev,
        board: room?.data?.board || new Array(20).fill(new Array(20).fill(null)),
        next,
        userTurn: !next ? room?.data?.firstPlayer : room?.data?.secondPlayer,
        lastTick: room?.data?.lastTick || null
      }));
    })();
    // eslint-disable-next-line
  }, [match.params.id]);

  useEffect(() => {
    if (room && user) {
      setGameData((prev) => ({
        ...prev,
        pos:
          room?.firstPlayer?._id === user._id ? 1 : room?.secondPlayer?._id === user._id ? 2 : null
      }));
    }
  }, [room, user]);

  // const limitInterval = useRef(false);

  const handleSendMessage = useCallback(
    (content) => {
      socket.emit('user-send-message', { roomId: match.params.id, user: user.email, content });
    },
    [match.params.id, user.email]
  );

  const handleOnUserPickPosition = useCallback(
    (newPos) => {
      if (!match.params.id) return;
      setCountdown(() => room?.time);
      if (newPos === 1) {
        setRoom((prev) => ({ ...prev, firstPlayer: user }));
        setGameData((prev) => ({
          ...prev,
          pos: 1
        }));
        socket.emit('change-side', { roomId: match.params.id, user, side: 1 });
      } else if (newPos === 2) {
        setRoom((prev) => ({ ...prev, secondPlayer: user }));
        setGameData((prev) => ({
          ...prev,
          pos: 2
        }));
        socket.emit('change-side', { roomId: match.params.id, user, side: 2 });
      } else {
        if (gameData.pos === 1) {
          setRoom((prev) => ({ ...prev, firstPlayer: null }));
        } else if (gameData.pos === 2) {
          setRoom((prev) => ({ ...prev, secondPlayer: null }));
        }
        setGameData((prev) => ({
          ...prev,
          pos: null
        }));
        socket.emit('change-side', { roomId: match.params.id, user, side: null });
      }
    },
    [user, match.params.id, gameData.pos, room?.time]
  );

  const handleTick = async (i, j) => {
    if (gameData.userTurn)
      if (user._id === gameData.userTurn._id) {
        const roomIdNum = Number(match.params.id);
        const newBoard = gameData.board.map((row, indexX) => {
          if (indexX === i)
            return row.map((column, indexY) => {
              if (indexY === j) return gameData.next ? 'X' : 'O';
              return column;
            });
          return row;
        });

        setGameData((prev) => ({
          ...prev,
          board: newBoard,

          lastTick: [i, j]
        }));

        if (await calculateWin(i, j, newBoard[i][j], newBoard)) {
          setUserAccepter(() => ({
            firstPlayer: false,
            secondPlayer: false
          }));
          socket.emit('game-end', {
            board: newBoard,
            roomId: roomIdNum,
            next: gameData.next,
            lastTick: [i, j]
          });
          setGameData((prev) => ({
            ...prev,
            started: false
          }));
        } else {
          socket.emit('room-change', {
            board: newBoard,
            roomId: roomIdNum,
            next: gameData.next,
            lastTick: [i, j]
          });
        }
      }
  };

  const handlePressStartGame = () => {
    const roomIdNum = Number(match.params.id);
    socket.emit('room-change', {
      board: new Array(20).fill(new Array(20).fill(null)),
      roomId: roomIdNum,
      next: gameData.next,
      move: 'reset'
    });
    setClockToggle(() => true);
    setCountdown(() => 10);
    socket.emit('press-start', { roomId: match.params.id, pos: gameData.pos });
  };

  let indicator = null; //
  if (gameData.pos === null) {
    indicator = (
      <div className="p-2 text-sm text-white bg-red-500 center-absolute">Pick a position</div>
    );
  }

  console.log(inviteList);

  if (gameData.pos) {
    if (
      room?.firstPlayer &&
      room?.secondPlayer &&
      !userAccepter.firstPlayer &&
      !userAccepter.secondPlayer
    ) {
      indicator =
        room?.firstPlayer._id === user._id ? (
          <button
            onClick={handlePressStartGame}
            type="button"
            className="flex flex-col justify-center p-2 text-sm text-white bg-red-500 center-absolute">
            {`${winner ? `${winner} \n` : ''} `}
            <span>Start game</span>
          </button>
        ) : (
          <button
            onClick={handlePressStartGame}
            type="button"
            className="flex flex-col justify-center p-2 text-sm text-white bg-red-500 center-absolute">
            {`${winner ? `${winner} \n` : ''} `}
            <span>Start game</span>
          </button>
        );
    }

    if (
      (gameData.pos === 1 && userAccepter.firstPlayer) ||
      (gameData.pos === 2 && userAccepter.secondPlayer)
    ) {
      indicator = (
        <div className="p-2 text-sm text-white bg-red-500 center-absolute">
          (00:{countdown} (waiting for confirm)
        </div>
      );
    } else if (
      (!userAccepter.firstPlayer && gameData.pos === 1 && userAccepter.secondPlayer) ||
      (!userAccepter.secondPlayer && gameData.pos === 2 && userAccepter.firstPlayer)
    ) {
      indicator = (
        <button
          onClick={handlePressStartGame}
          type="button"
          className="p-2 text-sm text-white bg-red-500 center-absolute">
          Start game (00:{countdown} time lefts)
        </button>
      );
    }

    if (userAccepter.firstPlayer && userAccepter.secondPlayer) {
      indicator = null;
    }

    if (gameData.pos === 1) {
      if (room?.secondPlayer === null) {
        indicator = (
          <div className="p-2 text-sm text-white bg-red-500 center-absolute">
            Waiting for player
          </div>
        );
      }
    }

    if (gameData.pos === 2) {
      if (room?.firstPlayer === null) {
        indicator = (
          <div className="p-2 text-sm text-white bg-red-500 center-absolute">
            Waiting for player
          </div>
        );
      }
    }
  }

  if (gameData.pos === null && room?.firstPlayer && room?.secondPlayer) {
    if (!gameData.started) {
      indicator = (
        <div className="p-2 text-sm text-white bg-red-500 center-absolute">Waiting for start</div>
      );
    } else {
      indicator = null;
    }
  }

  const handleClaimDraw = () => {
    if (gameData.userTurn._id === user._id) {
      socket.emit('claim-draw', { roomId: match.params.id });
    }
  };

  return (
    <Layout>
      <Spin spinning={!initStatus.init}>
        {initStatus.join && room && (
          <div className="flex justify-center max-h-full mt-10">
            <div className="flex flex-col w-80">
              <UserPlay
                pos={1}
                started={gameData.started}
                countdown={countdown}
                currentUserPos={gameData.pos}
                user={room?.firstPlayer}
                canLeave={!userAccepter.firstPlayer}
                onPickPosition={handleOnUserPickPosition}
                next={gameData.next}
              />
              <div className="flex-1 p-4 my-6 bg-gray-100 rounded-lg">
                <div className="flex flex-row">
                  <button
                    className="flex items-center px-3 py-2 font-medium text-white rounded-md bg-main"
                    type="button"
                    onClick={indicator ? null : handleClaimDraw}>
                    <FaHandshake className="mr-2" /> Claim a draw
                  </button>
                  <button
                    className="flex items-center px-3 py-2 ml-4 font-medium text-white rounded-md bg-main"
                    type="button"
                    onClick={handleResign}>
                    <AiOutlineFlag className="mr-2" /> Resign
                  </button>
                </div>
              </div>
              <UserPlay
                pos={2}
                started={gameData.started}
                countdown={countdown}
                currentUserPos={gameData.pos}
                user={room?.secondPlayer}
                canLeave={!userAccepter.secondPlayer}
                onPickPosition={handleOnUserPickPosition}
                next={gameData.next}
              />
            </div>

            <div className="flex items-center justify-center flex-shrink-0 px-3 mx-2 rounded-lg bg-board">
              <Spin spinning={indicator !== null} indicator={indicator}>
                <div className="play-area">
                  <Board board={gameData.board} />
                </div>
              </Spin>
            </div>

            <div className="flex flex-col w-80">
              <div className="relative flex-1 w-full">
                <div className="absolute top-0 bottom-0 left-0 right-0">
                  <Chat messages={chat} endRef={messageRef} onMessageSend={handleSendMessage} />
                </div>
              </div>
              <div className="flex-1 w-full h-full p-2 mt-6 bg-gray-100 rounded-lg">
                <Tabs defaultActiveKey="1" onChange={console.log}>
                  <TabPane tab="Moves" key="1">
                    <div className="relative flex-col flex-1 w-full">
                      <div className="absolute top-0 bottom-0 left-0 right-0">
                        {gameData.move.map((value, index) =>
                          value ? (
                            <span
                              key={index}
                              className="flex items-center justify-between p-2 mb-2 list-none bg-gray-200 rounded-md hover:bg-gray-300">
                              <span> {index}</span>
                              <span className="font-semibold text-yellow-600 ">{` ${value[0]} : ${value[1]}`}</span>
                            </span>
                          ) : null
                        )}
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="In Rooms" key="2">
                    {room.people.map((p) => (
                      <li
                        key={p._id}
                        className="flex items-center justify-between p-2 mb-2 list-none bg-gray-200 rounded-md hover:bg-gray-300">
                        <span> {p.email}</span>
                        <span className="font-semibold text-yellow-600 ">{p.point}</span>
                      </li>
                    ))}
                  </TabPane>
                  {room?.owner?._id === user._id && (
                    <TabPane tab="Invite" key="3">
                      <div className="flex flex-col">
                        <input
                          className="w-full px-3 py-1 mb-2 bg-gray-100 border rounded-md"
                          placeholder="Search for user..."
                        />
                        {searchFilter &&
                          searchFilter
                            .filter((el) => el._id !== user._id)
                            .map((invite) => (
                              <li
                                key={invite._id}
                                onClick={() => handleInviteClick(invite._id)}
                                className={clsx(
                                  'flex items-center justify-between p-2 mb-2 list-none bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300',
                                  inviteList[invite._id] && 'bg-yellow-300'
                                )}>
                                <span> {invite.email}</span>
                                <span className="font-semibold text-yellow-600 ">
                                  {invite.point}
                                </span>
                              </li>
                            ))}
                      </div>
                    </TabPane>
                  )}
                </Tabs>
              </div>
            </div>
            <Modal
              title="Opponent claim a draw!"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              okText="Accept"
              cancelText="Decline">
              <p>Win: +25 point</p>
              <p>Draw: -10 point</p>
              <p>Lose: -25 point</p>
            </Modal>
          </div>
        )}

        {initStatus.requirepass && (
          <div className="flex flex-col items-center justify-center flex-1 w-full h-full mt-20">
            <span className="-mt-5 text-lg font-semibold text-gray-800">
              This room requires password.
            </span>
            <div className="flex mt-3 ">
              {' '}
              <form onSubmit={handleSubmit(onSubmitPassword)}>
                <input
                  className="w-64 px-3 py-2 border rounded-lg focus:outline-none"
                  type="password"
                  name="password"
                  ref={register({ required: 'Required' })}
                  placeholder="Input password"
                />
                <button
                  disabled={errors.password}
                  className="h-full px-2 ml-3 font-semibold text-white rounded-lg focus:outline-none bg-main disabled:bg-gray-500"
                  type="submit">
                  Join room
                </button>
              </form>
            </div>
            {errors.password && <span className="font-semibold text-red-600">Wrong password.</span>}
          </div>
        )}
      </Spin>
    </Layout>
  );
};

export default Match;
