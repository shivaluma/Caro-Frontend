/* eslint-disable no-nested-ternary */
/* eslint-disable react/display-name */
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useLayout } from 'hooks';

import { RoomService } from 'services';
import { AiOutlineFlag } from 'react-icons/ai';
import { FaHandshake } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import socket from 'configs/socket';
import { Chat, UserPlay, Board } from './components';

const Room = ({ match }) => {
  // const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const [board, setBoard] = useState(new Array(15).fill(new Array(20).fill(null)));
  const [room, setRoom] = useState(null);
  const [next, setNext] = useState(true);
  const [pos, setPos] = useState(null);

  const calculateWin = (i, j, valuee) => {
    let count = 1;
    const value = valuee;
    let row = i;
    let column = j;

    // check 1
    while (true) {
      if (++column > 19) break;
      if (board[row][column] !== value) break;
      count++;
      if (count === 5) return value;
    }

    row = i;
    column = j;
    while (true) {
      if (--column < 0) break;
      if (board[row][column] !== value) break;
      count++;
      if (count === 5) return value;
    }

    count = 1;
    row = i;
    column = j;

    // check 2
    while (true) {
      if (++row > 14) break;
      if (board[row][column] !== value) break;
      count++;
      if (count === 5) return value;
    }

    row = i;
    column = j;

    while (true) {
      if (--row < 0) break;
      if (board[row][column] !== value) break;
      count++;
      if (count === 5) return value;
    }

    count = 1;
    row = i;
    column = j;

    // check 3
    while (true) {
      if (++row > 14) break;
      if (++column > 19) break;
      if (board[row][column] !== value) break;
      count++;
      if (count === 5) return value;
    }

    row = i;
    column = j;

    while (true) {
      if (--row < 0) break;
      if (--column < 0) break;
      if (board[row][column] !== value) break;
      count++;
      if (count === 5) return value;
    }

    count = 1;
    row = i;
    column = j;

    // check 4
    while (true) {
      if (++row > 14) break;
      if (--column < 0) break;
      if (board[row][column] !== value) break;
      count++;
      if (count === 5) return value;
    }

    row = i;
    column = j;

    while (true) {
      if (--row < 0) break;
      if (++column > 19) break;
      if (board[row][column] !== value) break;
      count++;
      if (count === 5) return value;
    }

    return null;
  };

  const handleTick = async (i, j) => {
    const newBoard = board.map((row, indexX) => {
      if (indexX === i)
        return row.map((column, indexY) => {
          if (indexY === j) return next ? 'X' : 'O';
          return column;
        });
      return row;
    });

    await setBoard([...newBoard]);
    if (calculateWin(i, j, newBoard[i][j])) alert(calculateWin(i, j, newBoard[i][j]));
    setNext(!next);
  };

  const Layout = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLayout({
        left: () => (
          <div key="leftHeader" className="ml-2 text-xl font-medium text-gray-800">
            {match.params.id !== null && `Room #${match.params.id}`}
          </div>
        )
      }),
    [match.params.id]
  );

  useEffect(() => {
    socket.on('player-change-side', ({ user, roomId, side, leaveSide }) => {
      console.log(user);
      console.log(roomId);
      console.log(side);

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
    });
  }, []);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    const roomIdNum = Number(match.params.id);
    if (!Number.isInteger(roomIdNum) || roomIdNum < 0 || roomIdNum >= 20) {
      console.log('tach');
      return;
    }
    (async () => {
      const room = await RoomService.getRoomById(roomIdNum, 'public');
      setRoom(room.data);

      socket.emit('join-room', { roomId: roomIdNum, user });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.id]);

  useEffect(() => {
    if (room && user) {
      console.log(room.firstPlayer);

      setPos(() =>
        room.firstPlayer?._id === user._id ? 1 : room.secondPlayer?._id === user._id ? 2 : null
      );
    }
  }, [room, user]);

  const handleOnUserPickPosition = useCallback(
    (newPos) => {
      if (!match.params.id) return;
      if (newPos === 1) {
        setRoom((prev) => ({ ...prev, firstPlayer: user }));
        setPos(() => 1);
        socket.emit('change-side', { roomId: match.params.id, user, side: 1 });
      } else if (newPos === 2) {
        setRoom((prev) => ({ ...prev, secondPlayer: user }));
        setPos(() => 2);
        socket.emit('change-side', { roomId: match.params.id, user, side: 2 });
      } else {
        if (pos === 1) {
          setRoom((prev) => ({ ...prev, firstPlayer: null }));
        } else if (pos === 2) {
          setRoom((prev) => ({ ...prev, secondPlayer: null }));
        }
        setPos(() => null);
        socket.emit('change-side', { roomId: match.params.id, user, side: null });
      }
    },
    [user, match.params.id, pos]
  );

  return (
    <Layout>
      {room && (
        <div className="flex justify-center max-h-full mt-10">
          <div className="flex flex-col w-80">
            <UserPlay
              pos={1}
              currentUserPos={pos}
              user={room.firstPlayer}
              onPickPosition={handleOnUserPickPosition}
            />
            <div className="flex-1 p-4 my-6 bg-gray-100 rounded-lg">
              <div className="flex flex-row">
                <button
                  className="flex items-center px-3 py-2 font-medium text-white rounded-md bg-main"
                  type="button">
                  <FaHandshake className="mr-2" /> Claim a draw
                </button>
                <button
                  className="flex items-center px-3 py-2 ml-4 font-medium text-white rounded-md bg-main"
                  type="button">
                  <AiOutlineFlag className="mr-2" /> Resign
                </button>
              </div>
            </div>
            <UserPlay
              pos={2}
              currentUserPos={pos}
              user={room.secondPlayer}
              onPickPosition={handleOnUserPickPosition}
            />
          </div>

          <div className="flex items-center justify-center h-full px-3 mx-2 rounded-lg bg-board">
            <div className="play-area">
              <Board onClick={(i, j) => handleTick(i, j)} board={board} />
            </div>
          </div>

          <div className="w-80">
            <Chat />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Room;
