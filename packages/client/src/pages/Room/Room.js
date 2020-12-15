/* eslint-disable react/display-name */
import { useMemo } from 'react';
import { useLayout } from 'hooks';

import { useSelector } from 'react-redux';
import { Board, Chat, UserPlay, WatchList } from './components';

const Room = () => {
  // const dispatch = useDispatch();
  const onlines = useSelector((state) => state.online);
  console.log(onlines);

  const Layout = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLayout({
        left: () => (
          <div key="leftHeader" className="ml-2 text-xl font-medium text-gray-800">
            Rooms
          </div>
        ),
        right: () => <div key="right" className="ml-4" />,
      }),
    []
  );

  return (
    <Layout>
      <div className="hidden left-pane w-80 xl:block">
        <div className="flex flex-col mt-2">
          <span className="text-lg font-medium text-center">
            <h3>Chat</h3>
          </span>
          <Chat />
        </div>
      </div>

      <div className="container flex flex-col mx-auto mt-10">
        <div className="play-area">
          <Board />
        </div>
        <div className="flex flex-wrap w-full mt-8" />
      </div>

      {/* <div className="flex flex-col">
        <h5>Who is online?</h5>
        <ul>
          {onlines.map((email) => (
            <li key={email}>{email}</li>
          ))}
        </ul>
      </div> */}

      <div className="hidden pl-5 right-pane w-80 xl:block">
        <div className="flex flex-col mt-2">
          <span className="text-lg font-medium text-center">People in room</span>
          <span className="text-lg font-medium">Player 1</span>
          <UserPlay />

          <span className="text-lg font-medium">Player 2</span>
          <UserPlay />

          <span className="text-lg font-medium text-center">Watches</span>
          <WatchList />
        </div>
      </div>
    </Layout>
  );
};

export default Room;
