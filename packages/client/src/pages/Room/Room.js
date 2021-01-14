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

import { useForm } from 'react-hook-form';
import { changeRoom } from 'slices/user';
import { postCheckPassword } from 'services/room';
import { useDebounce } from 'hooks';
import clsx from 'clsx';
import { Chat, UserPlay, Board } from './components';

const { TabPane } = Tabs;
const Room = ({ match, history, location }) => {
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
    requirepass: location?.state?.requirepass,
    join: false
  });

  const [countdown, setCountdown] = useState(null);
  const [userAccepter, setUserAccepter] = useState({ firstPlayer: false, secondPlayer: false });

  const user = useSelector((state) => state.user);
  const onlines = useSelector((state) => state.online);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [nameFilter, setNameFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState([]);
  const [clockToggle, setClockToggle] = useState(false);
  const [inviteList, setInviteList] = useState({});
  const nameFilterDebounce = useDebounce(nameFilter, 300);
  const [timeMileStone, setTimeMileStone] = useState(null);
  const onUserJoinRoom = useCallback((user) => {
    setRoom((prev) => ({
      ...prev,
      people: [...prev.people, user]
    }));
  }, []);

  const handleLeaveRoomClick = useCallback(() => {
    dispatch(changeRoom(null));
    socket.emit('user-leave-room', { roomId: Number(match.params.id), user });
    socket.emit('change-side', { roomId: match.params.id, user, side: null });
    history.push('/');
  }, [history, user, match.params.id, dispatch]);

  useEffect(() => {
    setSearchFilter(() => onlines.filter((el) => el.displayName.includes(nameFilterDebounce)));
  }, [nameFilterDebounce, onlines]);

  const handleChangeNameFilter = (e) => {
    setNameFilter(e.target.value);
  };

  useEffect(() => {
    if (initStatus.join) return;
    if (room && user) {
      if (
        location?.state?.requirepass === false ||
        !room.password ||
        room.people.findIndex((u) => u._id === user._id) !== -1
      ) {
        setInitStatus(() => ({
          init: true,
          requirepass: false,
          join: true
        }));

        setRoom(() => {
          if (room.people.findIndex((u) => u._id === user._id) === -1) {
            return { ...room, people: [user, ...room.people] };
          }
          return room;
        });

        return;
      }
      if (room.password && room.people.findIndex((u) => u._id === user._id) === -1) {
        setInitStatus(() => ({
          init: true,
          requirepass: true
        }));
      }
    }
  }, [room, user, initStatus.join, location?.state?.requirepass]);

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
            disabled={gameData.started}
            className="px-3 py-2 mr-2 font-semibold border-2 rounded-full text-main border-main disabled:border-gray-500 disabled:cursor-not-allowed disabled:text-gray-500">
            Leave Room
          </button>
        )
      }),
    [match.params.id, handleLeaveRoomClick, gameData.started]
  );

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
    socket.on('room-change-cli', ({ board, next, user, lastTick, move, newTurnMilestone }) => {
      setGameData((prev) => ({
        ...prev,
        board,
        next: !next,
        userTurn: user,
        lastTick,
        move
      }));
      setCountdown(() => room?.time);
      setTimeMileStone(() => new Date(newTurnMilestone) || new Date());
    });

    socket.on('press-start', ({ pos }) => {
      if (pos === 1) {
        setUserAccepter((prev) => ({ ...prev, firstPlayer: true }));
      } else {
        setUserAccepter((prev) => ({ ...prev, secondPlayer: true }));
      }

      setWinner(null);

      setClockToggle(() => true);
    });

    socket.on('game-end-cli', ({ next, lastTick }) => {
      console.log('Game end');
      if (next === null) {
        setWinner('Draw');
      } else {
        setWinner(next === true ? 'Player 1 win' : 'Player 2 win');
      }
      setUserAccepter(() => ({
        firstPlayer: false,
        secondPlayer: false
      }));

      setIsModalVisible(false);

      setGameData((prev) => ({
        ...prev,
        board: new Array(20).fill(new Array(20).fill(null)),
        next: !next,
        started: false,
        userTurn: null,
        lastTick,
        move: []
      }));
      // setCountdown(() => room?.time);
      setTimeMileStone(() => new Date());
      setClockToggle(() => false);
    });

    socket.on('claim-draw-cli', ({ userDraw }) => {
      console.log(userDraw);
      if (user._id === userDraw?._id) {
        setIsModalVisible(true);
      }
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

    return () => {
      socket.off('player-change-side');
      socket.off('room-change-cli');
      socket.off('press-start');
      socket.off('game-end-cli');
      socket.off('claim-draw-cli');
      socket.off('new-chat-message');
      socket.off('user-join-room');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initStatus.init, onUserJoinRoom, room?.time]);

  useEffect(() => {
    if (!winner) return;
    if (winner === 'Player 1 win') {
      const firstPlayer = room?.firstPlayer ? { ...room?.firstPlayer } : null;
      const secondPlayer = room?.secondPlayer ? { ...room?.secondPlayer } : null;

      if (firstPlayer) {
        firstPlayer.wincount += 1;
        firstPlayer.point += 25;
      }

      if (secondPlayer) {
        secondPlayer.losecount += 1;
        secondPlayer.point -= 25;
      }
      setRoom((prev) => ({ ...prev, firstPlayer, secondPlayer }));
      setGameData((prev) => ({
        ...prev,
        started: false
      }));
    }

    if (winner === 'Player 2 win') {
      const firstPlayer = room?.firstPlayer ? { ...room?.firstPlayer } : null;
      const secondPlayer = room?.secondPlayer ? { ...room?.secondPlayer } : null;

      if (firstPlayer) {
        firstPlayer.losecount += 1;
        firstPlayer.point -= 25;
      }

      if (secondPlayer) {
        secondPlayer.wincount += 1;
        secondPlayer.point += 25;
      }
      setRoom((prev) => ({ ...prev, firstPlayer, secondPlayer }));
    }

    if (winner === 'Draw') {
      const firstPlayer = room?.firstPlayer ? { ...room?.firstPlayer } : null;
      const secondPlayer = room?.secondPlayer ? { ...room?.secondPlayer } : null;

      if (firstPlayer) {
        firstPlayer.drawcount += 1;
        firstPlayer.point -= 10;
      }

      if (secondPlayer) {
        secondPlayer.drawcount += 1;
        secondPlayer.point -= 10;
      }
      setRoom((prev) => ({ ...prev, firstPlayer, secondPlayer }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  useEffect(() => {
    socket.on('user-leave-room', (leaveUser) => {
      setChat((prev) => [
        ...prev,
        { sender: 'Admin', content: `A user has leaved the room : ${leaveUser.displayName}` }
      ]);
      onUserLeaveRoom(leaveUser);

      console.log(leaveUser);
      if (room?.firstPlayer?._id === leaveUser._id || room?.secondPlayer?._id === leaveUser._id) {
        setGameData((prev) => ({
          ...prev,
          board: new Array(20).fill(new Array(20).fill(null)),

          started: false,
          userTurn: null,
          lastTick: null,
          move: []
        }));
        setCountdown(() => room?.time);
        setClockToggle(() => false);
        setUserAccepter(() => ({
          firstPlayer: false,
          secondPlayer: false
        }));
      }

      // if (gameData.pos && gameData.started) {
      //   console.log('GAME LEAVE gamedata pos');
      //   const roomIdNum = Number(match.params.id);
      //   if (room?.firstPlayer?._id === leaveUser._id) {
      //     console.log('player 1 leave');
      //     socket.emit('game-end', {
      //       board: gameData.board,
      //       roomId: roomIdNum,
      //       next: gameData.next,
      //       lastTick: [3, 3],
      //       lose: room?.firstPlayer
      //     });
      //   }
      //   if (room?.secondPlayer?._id === leaveUser._id) {
      //     console.log('player 2 leave');
      //     socket.emit('game-end', {
      //       board: gameData.board,
      //       roomId: roomIdNum,
      //       next: gameData.next,
      //       lastTick: [3, 3],
      //       lose: room?.secondPlayer
      //     });
      //   }
      // }

      if (!messageRef.current) return;
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    });
    return () => {
      socket.off('user-leave-room');
    };
  }, [room?.firstPlayer, room?.secondPlayer, match?.params?.id, room?.time, onUserLeaveRoom]);

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

      setRoom(() => {
        return room.data;
      });

      setChat(room?.data?.chats.length > 0 ? room?.data?.chats : [...initChat]);

      const next = room?.data?.next != null ? !room.data.next : true;

      setGameData((prev) => ({
        ...prev,
        board: room?.data?.board || new Array(20).fill(new Array(20).fill(null)),
        next,
        userTurn: next ? room?.data?.firstPlayer : room?.data?.secondPlayer,
        lastTick: room?.data?.lastTick || null,
        started: room?.data?.started || false
      }));

      setTimeMileStone(() =>
        room?.data?.newTurnMilestone ? new Date(room?.data?.newTurnMilestone) : new Date()
      );

      if (room?.data?.started) {
        setClockToggle(() => true);
      }

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
  }, [initStatus.join, match.params.id, dispatch, user.room]);

  useEffect(() => {
    if (room && user) {
      setGameData((prev) => ({
        ...prev,
        pos:
          room?.firstPlayer?._id === user._id ? 1 : room?.secondPlayer?._id === user._id ? 2 : null
      }));
    }
  }, [room, user]);

  useEffect(() => {
    if (gameData.started) return;
    if (countdown === 0 && !(userAccepter.firstPlayer && userAccepter.secondPlayer)) {
      setClockToggle(() => false);
      if (!room?.firstPlayer?._id || !room?.secondPlayer?._id) return;

      if (!userAccepter.firstPlayer && room?.firstPlayer._id === user._id) {
        setRoom((prev) => ({ ...prev, firstPlayer: null }));
        setGameData((prev) => ({
          ...prev,
          pos: null
        }));
        socket.emit('change-side', { roomId: match.params.id, user, side: null });
      } else if (!userAccepter.secondPlayer && room?.secondPlayer._id === user._id) {
        setRoom((prev) => ({ ...prev, secondPlayer: null }));
        setGameData((prev) => ({
          ...prev,
          pos: null
        }));
        socket.emit('change-side', { roomId: match.params.id, user, side: null });
      }
      setCountdown(() => room?.time);
      setUserAccepter(() => ({
        firstPlayer: false,
        secondPlayer: false
      }));
    }
  }, [
    countdown,
    userAccepter.firstPlayer,
    userAccepter.secondPlayer,
    gameData.started,
    room?.firstPlayer,
    room?.secondPlayer,
    room?.time,
    match.params.id,
    user
  ]);

  useEffect(() => {
    if (userAccepter.firstPlayer && userAccepter.secondPlayer) {
      setCountdown(() => room?.time);

      if (!timeMileStone) {
        setTimeMileStone(() => new Date());
      }

      setGameData((prev) => ({
        ...prev,
        started: true
      }));
    }
  }, [userAccepter, room?.time, timeMileStone]);

  useEffect(() => {
    if (gameData.started) {
      if (countdown === 0) {
        if (gameData.pos === 1 && gameData?.userTurn?._id !== user._id) {
          const roomIdNum = Number(match.params.id);
          socket.emit('game-end', {
            board: gameData.board,
            roomId: roomIdNum,
            next: gameData.next,
            lastTick: [3, 3],
            lose: room?.secondPlayer
          });
        } else if (gameData.pos === 2 && gameData?.userTurn?._id !== user._id) {
          const roomIdNum = Number(match.params.id);
          socket.emit('game-end', {
            board: gameData.board,
            roomId: roomIdNum,
            next: gameData.next,
            lastTick: [3, 3],
            lose: room?.firstPlayer
          });
        }

        setClockToggle(() => false);
        if (!room?.firstPlayer?._id || !room?.secondPlayer?._id) return;
        if (room?.firstPlayer._id === user._id && user._id !== gameData?.userTurn?._id) {
          setRoom((prev) => ({ ...prev, secondPlayer: null }));
          socket.emit('change-side', {
            roomId: match.params.id,
            user: room?.secondPlayer,
            side: null
          });
        } else if (room?.secondPlayer._id === user._id && user._id !== gameData?.userTurn?._id) {
          setRoom((prev) => ({ ...prev, firstPlayer: null }));

          socket.emit('change-side', {
            roomId: match.params.id,
            user: room?.firstPlayer,
            side: null
          });
        }
        setCountdown(() => room?.time);
        setTimeMileStone(() => new Date());
        setUserAccepter(() => ({
          firstPlayer: false,
          secondPlayer: false
        }));
        // setUserAccepter(() => ({
        //   firstPlayer: false,
        //   secondPlayer: false
        // }));
        // setGameData((prev) => ({
        //   ...prev,
        //   started: false
        // }));
        // setClockToggle(() => false);
        // setCountdown(() => room?.time);
      }
    }
  }, [
    gameData.started,
    countdown,
    gameData.board,
    gameData.pos,
    gameData.next,
    match.params.id,
    room?.time,
    user,
    gameData?.userTurn?._id,
    room?.firstPlayer,
    room?.secondPlayer
  ]);

  // const limitInterval = useRef(false);
  useEffect(() => {
    let interval;
    if (clockToggle) {
      interval = setInterval(() => {
        setCountdown(() => {
          const t1 = new Date();
          const t2 = timeMileStone;
          const dif = t1.getTime() - t2.getTime();

          const seconds = room?.time - Math.round(dif / 1000);
          if (seconds === 0) {
            clearInterval(interval);
          }
          return seconds;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [clockToggle, timeMileStone, room?.time]);

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
      setTimeMileStone(() => new Date());
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
          <div className="flex flex-col p-2 text-sm text-white bg-red-500 center-absolute">
            {winner && <span>{winner}</span>}
            Waiting for player
          </div>
        );
      }
    }

    if (gameData.pos === 2) {
      if (room?.firstPlayer === null) {
        indicator = (
          <div className="flex flex-col p-2 text-sm text-white bg-red-500 center-absolute">
            {winner && <span>{winner}</span>}
            Waiting for player
          </div>
        );
      }
    }
  }

  if (gameData.pos === null && room?.firstPlayer && room?.secondPlayer) {
    if (!gameData.started) {
      indicator = (
        <div className="flex flex-col p-2 text-sm text-white bg-red-500 center-absolute">
          {winner && <span>{winner}</span>}
          <span>Waiting for start</span>
        </div>
      );
    } else {
      indicator = null;
    }
  }

  const handleClaimDraw = () => {
    if (gameData.userTurn._id === user._id) {
      socket.emit('claim-draw', { roomId: match.params.id, user });
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
    setGameData((prev) => ({
      ...prev,
      started: true
    }));
    socket.emit('game-end', {
      board: gameData.board,
      roomId: roomIdNum,
      next: gameData.next,
      lastTick: null,
      lose: 'draw'
    });

    setIsModalVisible(false);
  };

  const onSubmitPassword = async ({ password }) => {
    try {
      await postCheckPassword(Number(match.params.id), password);
      setInitStatus((prev) => ({ ...prev, join: true, requirepass: false }));

      onUserJoinRoom(user);
    } catch (err) {
      setError('password', { type: 'manual', message: 'Required.' });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInviteClick = (userId) => {
    if (inviteList[userId]) return;
    setInviteList((prev) => ({ ...prev, [userId]: 'pending' }));

    setTimeout(() => {
      setInviteList((prev) => ({ ...prev, [userId]: null }));
    }, 20000);

    socket.emit('game-invite', {
      roomId: Number(match.params.id),
      userId,
      inviteName: user.displayName
    });
  };

  const { handleSubmit, register, errors, setError } = useForm();

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
                    className="flex items-center px-3 py-2 font-medium text-white rounded-md bg-main disabled:bg-gray-300"
                    type="button"
                    disabled={!gameData.pos || gameData?.userTurn?._id !== user?._id}
                    onClick={indicator ? null : handleClaimDraw}>
                    <FaHandshake className="mr-2" /> Claim a draw
                  </button>
                  <button
                    className="flex items-center px-3 py-2 ml-4 font-medium text-white rounded-md bg-main disabled:bg-gray-300 disabled:cursor-not-allow"
                    type="button"
                    disabled={!gameData.pos}
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
                          onChange={handleChangeNameFilter}
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

export default Room;
