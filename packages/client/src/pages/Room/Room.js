/* eslint-disable react/display-name */
import { useMemo, useState, useEffect } from 'react';
import { useLayout } from 'hooks';

import { RoomService } from 'services';
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

      setRoom(room.data);
    })();
  }, [match.params.id]);

  return (
    <Layout>
      <div className="flex justify-center max-h-full mt-10">
        <div className="flex flex-col w-80">
          <UserPlay />
          <div className="flex-1" />
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
    </Layout>
  );
};

export default Room;
