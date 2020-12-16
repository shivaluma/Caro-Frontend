/* eslint-disable react/display-name */
import { useMemo, useState, useEffect } from 'react';
import { useLayout } from 'hooks';

import { RoomService } from 'services';
import { AiOutlineFlag } from 'react-icons/ai';
import { FaHandshake } from 'react-icons/fa';
import { Chat, UserPlay, Board } from './components';

const Room = ({ match }) => {
  // const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const [room, setRoom] = useState(null);
  const Layout = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLayout({
        left: () => (
          <div key="leftHeader" className="ml-2 text-xl font-medium text-gray-800">
            {match.params.id !== null && `Room #${match.params.id}`}
          </div>
        ),
      }),
    [match.params.id]
  );

  useEffect(() => {
    const roomIdNum = Number(match.params.id);
    if (!Number.isInteger(roomIdNum) || roomIdNum < 0 || roomIdNum >= 20) {
      console.log('tach');
      return;
    }
    (async () => {
      const room = await RoomService.getRoomById(roomIdNum, 'public');
      console.log(room.data);
      setRoom(room.data);
    })();
  }, [match.params.id]);

  return (
    <Layout>
      {room && (
        <div className="flex justify-center max-h-full mt-10">
          <div className="flex flex-col w-80">
            <UserPlay user={room.firstPlayer} />
            <div className="flex-1 p-4 my-6 bg-gray-100 rounded-lg">
              <div className="flex flex-row">
                <button className="flex items-center px-3 py-2 font-medium text-white rounded-md bg-main" type="button">
                  <FaHandshake className="mr-2" /> Claim a draw
                </button>
                <button
                  className="flex items-center px-3 py-2 ml-4 font-medium text-white rounded-md bg-main"
                  type="button">
                  <AiOutlineFlag className="mr-2" /> Resign
                </button>
              </div>
            </div>
            <UserPlay />
          </div>

          <div className="flex items-center justify-center h-full px-3 mx-2 rounded-lg bg-board">
            <div className="play-area">
              <Board />
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
