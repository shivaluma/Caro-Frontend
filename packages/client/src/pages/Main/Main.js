/* eslint-disable react/display-name */
import { useMemo } from 'react';
import { useLayout } from 'hooks';

import { useSelector } from 'react-redux';

const Main = () => {
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
      }),
    []
  );

  return (
    <Layout>
      <div className="flex flex-col">
        <h5>Who is online?</h5>
        <ul>
          {onlines.map((email) => (
            <li key={email}>{email}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Main;
