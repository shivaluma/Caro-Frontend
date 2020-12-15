/* eslint-disable react/display-name */
import { useMemo } from 'react';
import { useLayout } from 'hooks';

import { useSelector } from 'react-redux';
import { AddButton, GameButton } from './components';

const Main = () => {
  // const dispatch = useDispatch();
  const onlines = useSelector((state) => state.online);
  const Layout = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLayout({
        left: () => (
          <div key="leftHeader" className="ml-2 text-xl font-medium text-gray-800">
            Rooms
          </div>
        ),
      }),
    []
  );

  return (
    <Layout>
      <div className="container flex flex-col mx-auto mt-10">
        <span className="w-full pb-3 text-3xl border-b border-gray-400">{`All rooms (${onlines.length})`}</span>

        <div className="flex flex-wrap w-full mt-8">
          <AddButton handleClick={() => {}} />
          {onlines?.length > 0 && onlines.map((online) => <GameButton key={online} name={online} id={online} />)}
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
