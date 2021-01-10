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
import { Chat, UserPlay, Board } from './components';

const { Option } = Select;

const { TabPane } = Tabs;
const Room = ({ match, history }) => {
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const messageRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [chat, setChat] = useState([]);
  const [winner, setWinner] = useState(null);
  const [gameData, setGameData] = useState({
    board: new Array(20).fill(new Array(20).fill(null)),
    next: true,
    pos: null,
    userTurn: null,
    lastTick: null,
    started: false,
    move: []
  });

  const [initStatus, setInitStatus] = useState({
    init: false,
    requirepass: false,
    join: false
  });

  const [countdown, setCountdown] = useState(null);
  const [userAccepter, setUserAccepter] = useState({ firstPlayer: false, secondPlayer: false });

  const user = useSelector((state) => state.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');
  const [password, setPassword] = useState('');

  const handleLeaveRoomClick = useCallback(() => {
    dispatch(changeRoom(null));
    socket.emit('user-leave-room', { roomId: Number(match.params.id), user });
    socket.emit('change-side', { roomId: match.params.id, user, side: null });
    history.push('/');
  }, [history, user, match.params.id, dispatch]);

  useEffect(() => {
    if (initStatus.join) return;
    if (room && user) {
      if (!room.password || room.people.findIndex((u) => u._id === user._id) !== -1) {
        setInitStatus(() => ({
          init: true,
          requirepass: false,
          join: true
        }));
        return;
      }
      if (room.password && room.people.findIndex((u) => u._id === user._id) === -1) {
        setInitStatus(() => ({
          init: true,
          requirepass: true
        }));
      }
    }
  }, [room, user, initStatus.join]);

  const Layout = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLayout({
        left: () => (
          <div key="leftHeader" className="ml-2 text-xl font-medium text-gray-800">
            {match.params.id !== null && `Room #${match.params.id}`}
          </div>
        ),
        right: () => (
          <button
            type="button"
            key="right"
            onClick={handleLeaveRoomClick}
            className="px-3 py-2 mr-2 font-semibold border-2 rounded-full text-main border-main">
            Leave Room
          </button>
        )
      }),
    [match.params.id, handleLeaveRoomClick]
  );

  const onUserJoinRoom = useCallback((user) => {
    setRoom((prev) => ({
      ...prev,
      people: [...prev.people, user]
    }));
  }, []);

  const onUserLeaveRoom = useCallback((user) => {
    setRoom((prev) => ({
      ...prev,
      people: prev.people.filter((p) => p._id !== user._id)
    }));
  }, []);

  const hasRunRef = useRef(false);
  useEffect(() => {
    if (!initStatus.init) return;
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    socket.on('player-change-side', ({ user, side, leaveSide, userTurn }) => {
      if (side === 1) {
        setRoom((prev) => ({ ...prev, firstPlayer: user }));
      } else if (side === 2) {
        setRoom((prev) => ({ ...prev, secondPlayer: user }));
      }

      if (leaveSide === 1) {
        setRoom((prev) => ({ ...prev, firstPlayer: null }));
      } else if (leaveSide === 2) {
        setRoom((prev) => ({ ...prev, secondPlayer: null }));
      }
      setGameData((prev) => ({
        ...prev,
        userTurn
      }));
    });
    socket.on('room-change-cli', ({ board, next, user, lastTick, move }) => {
      setGameData((prev) => ({
        ...prev,
        board,
        next: !next,
        userTurn: user,
        lastTick,
        move
      }));
    });

    socket.on('press-start', ({ pos }) => {
      if (pos === 1) {
        setUserAccepter((prev) => ({ ...prev, firstPlayer: true }));
      } else {
        setUserAccepter((prev) => ({ ...prev, secondPlayer: true }));
      }
      setCountdown(() => 10);
    });

    socket.on('game-end-cli', ({ board, next, lastTick, move }) => {
      if (next === null) {
        setWinner('Draw');
      } else {
        setWinner(next === true ? 'Player 1 win' : 'Player 2 win');
      }
      setGameData((prev) => ({
        ...prev,
        board,
        next: !next || true,
        userTurn: null,
        lastTick,
        move
      }));

      setUserAccepter(() => ({
        firstPlayer: false,
        secondPlayer: false
      }));
    });

    socket.on('claim-draw-cli', () => {
      setIsModalVisible(true);
    });

    socket.on('new-chat-message', (message) => {
      setChat((prev) => [...prev, message]);
      if (!messageRef.current) return;
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    });

    socket.on('user-join-room', (user) => {
      setChat((prev) => [
        ...prev,
        { sender: 'Admin', content: `New user has joined the room : ${user.email}` }
      ]);

      onUserJoinRoom(user);
      if (!messageRef.current) return;
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    });

    socket.on('user-leave-room', (user) => {
      setChat((prev) => [
        ...prev,
        { sender: 'Admin', content: `A user has leaved the room : ${user.email}` }
      ]);
      onUserLeaveRoom(user);
      if (!messageRef.current) return;
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    });
  }, [initStatus.init, onUserJoinRoom, onUserLeaveRoom]);

  console.log(room);
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
      setRoom(() => room.data);

      const initChat =
        room?.data?.owner?._id === user._id
          ? [
              {
                sender: 'Admin',
                content: 'Your are the owner of this room, you can change the game settings.',
                createdAt: new Date()
              }
            ]
          : [];

      setChat(room?.data?.chats.length > 0 ? room?.data?.chats : [...initChat]);

      const next = room?.data?.next != null ? !room.data.next : true;

      setGameData((prev) => ({
        ...prev,
        board: room?.data?.board || new Array(20).fill(new Array(20).fill(null)),
        next,
        userTurn: !next ? room?.data?.firstPlayer : room?.data?.secondPlayer,
        lastTick: room?.data?.lastTick || null,
        started: room?.data?.started || false
      }));

      setUserAccepter(() => ({
        firstPlayer: room?.data?.ready?.firstPlayer || false,
        secondPlayer: room?.data?.ready?.secondPlayer || false
      }));
    })();
    // eslint-disable-next-line
  }, [match.params.id]);

  useEffect(() => {
    if (initStatus.join) {
      const roomIdNum = Number(match.params.id);

      socket.emit('join-room', { roomId: roomIdNum, user });
    }
  }, [initStatus.join, user, match.params.id, dispatch]);

  useEffect(() => {
    if (initStatus.join) {
      const roomIdNum = Number(match.params.id);
      dispatch(changeRoom(roomIdNum));
    }
  }, [initStatus.join, match.params.id, dispatch]);

  useEffect(() => {
    if (room && user) {
      setGameData((prev) => ({
        ...prev,
        pos: room.firstPlayer?._id === user._id ? 1 : room.secondPlayer?._id === user._id ? 2 : null
      }));
    }
  }, [room, user]);

  useEffect(() => {
    if (userAccepter.firstPlayer && userAccepter.secondPlayer) {
      setCountdown(() => 0);
    }
  }, [userAccepter]);

  const handleSendMessage = useCallback(
    (content) => {
      socket.emit('user-send-message', { roomId: match.params.id, user: user.email, content });
    },
    [match.params.id, user.email]
  );

  const handleOnUserPickPosition = useCallback(
    (newPos) => {
      if (!match.params.id) return;
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
    [user, match.params.id, gameData.pos]
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
      next: gameData.next
    });
    socket.emit('press-start', { roomId: match.params.id, pos: gameData.pos });
  };

  let indicator = null; //
  if (gameData.pos === null) {
    indicator = (
      <div className="p-2 text-sm text-white bg-red-500 center-absolute">Pick a position</div>
    );
  }

  if (gameData.pos) {
    if (
      room.firstPlayer &&
      room.secondPlayer &&
      !userAccepter.firstPlayer &&
      !userAccepter.secondPlayer
    ) {
      indicator =
        room.firstPlayer._id === user._id ? (
          <button
            onClick={handlePressStartGame}
            type="button"
            className="p-2 text-sm text-white bg-red-500 center-absolute">
            {`${winner ? `${winner} ` : ''} Start game`}
          </button>
        ) : (
          <button
            onClick={handlePressStartGame}
            type="button"
            className="p-2 text-sm text-white bg-red-500 center-absolute">
            {`${winner ? `${winner} ` : ''} Start game`}
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
      if (room.secondPlayer === null) {
        indicator = (
          <div className="p-2 text-sm text-white bg-red-500 center-absolute">
            Waiting for player
          </div>
        );
      }
    }
    if (gameData.pos === 2) {
      if (room.firstPlayer === null) {
        indicator = (
          <div className="p-2 text-sm text-white bg-red-500 center-absolute">
            Waiting for player
          </div>
        );
      }
    }
  }

  const handleClaimDraw = () => {
    if (gameData.userTurn._id === user._id) {
      socket.emit('claim-draw', { roomId: match.params.id });
    }
  };

  const handleResign = () => {
    if (gameData.lastTick) {
      const roomIdNum = Number(match.params.id);
      socket.emit('game-end', {
        board: gameData.board,
        roomId: roomIdNum,
        next: gameData.next,
        lastTick: null,
        lose: user
      });
    }
  };

  const handleOk = () => {
    const roomIdNum = Number(match.params.id);
    socket.emit('game-end', {
      board: gameData.board,
      roomId: roomIdNum,
      next: gameData.next,
      lastTick: null,
      lose: 'draw'
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  console.log(room);

  const onSubmitPassword = async ({ password }) => {
    try {
      const data = await postCheckPassword(Number(match.params.id), password);
      setInitStatus((prev) => ({ ...prev, join: true, requirepass: false }));
    } catch (err) {
      setError('password', { type: 'manual', message: 'Required.' });
    }
  };

  const { handleSubmit, register, errors, setError } = useForm();

  return (
    <Layout>
      {initStatus.join && room && (
        <div className="flex justify-center max-h-full mt-10">
          <div className="flex flex-col w-80">
            <UserPlay
              pos={1}
              currentUserPos={gameData.pos}
              user={room.firstPlayer}
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
              currentUserPos={gameData.pos}
              user={room.secondPlayer}
              canLeave={!userAccepter.secondPlayer}
              onPickPosition={handleOnUserPickPosition}
              next={gameData.next}
            />
          </div>

          <div className="flex items-center justify-center flex-shrink-0 px-3 mx-2 rounded-lg bg-board">
            <Spin spinning={indicator !== null} indicator={indicator}>
              <div className="play-area">
                <Board
                  onClick={(i, j) => handleTick(i, j)}
                  board={gameData.board}
                  lastTick={gameData.lastTick}
                />
              </div>
            </Spin>
          </div>

          <div className="flex flex-col w-80">
            <div className="relative flex-1 w-full">
              <div className="absolute top-0 bottom-0 left-0 right-0">
                <Chat messages={chat} endRef={messageRef} onMessageSend={handleSendMessage} />
              </div>
            </div>
            <div className="flex-1 w-full p-2 mt-6 bg-gray-100 rounded-lg">
              <Tabs defaultActiveKey="1" onChange={console.log}>
                <TabPane tab="Moves" key="1">
                  {gameData.move}
                </TabPane>
                <TabPane tab="In Rooms" key="2">
                  {room.people.map((p) => (
                    <li key={p._id} className="list-none">
                      {p.email}
                    </li>
                  ))}
                </TabPane>
                <TabPane tab="Rules" key="3">
                  <div className="flex">
                    <Select defaultValue="public" style={{ width: 120 }} onChange={() => {}}>
                      <Option value="jack">private</Option>
                    </Select>
                    <Input className="ml-2" placeholder="Password" />
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
          <Modal
            title="Opponent claim a draw!"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText="Decline"
            okText="Accept"
          />
        </div>
      )}

      {initStatus.requirepass && (
        <div className="flex flex-col items-center justify-center flex-1 w-full h-full">
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
    </Layout>
  );
};

export default Room;
