/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/display-name */
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useLayout } from 'hooks';
import { Spin } from 'antd';
import { Tabs } from 'antd';
import { RoomService } from 'services';
import { Chat, UserPlay, Board } from './components';

const { TabPane } = Tabs;
const Match = ({ match }) => {
  // eslint-disable-next-line no-unused-vars
  const [gameData, setGameData] = useState(null);

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
    if (!match.params.id) return;
    (async () => {
      try {
        const data = await RoomService.getMatchById(match.params.id);
        setGameData(data?.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [match.params.id]);

  return (
    <Layout>
      <Spin spinning={!gameData}>
        {gameData && (
          <div className="flex justify-center max-h-full mt-10">
            <div className="flex flex-col w-80">
              <UserPlay user={gameData.firstPlayer} winner={gameData.winner} />
              <UserPlay user={gameData.secondPlayer} winner={gameData.winner} />
            </div>

            <div className="flex items-center justify-center flex-shrink-0 px-3 mx-2 rounded-lg bg-board">
              <div className="play-area">
                <Board board={gameData.board} />
              </div>
            </div>

            <div className="flex flex-col w-80">
              <div className="relative flex-1 w-full">
                <div className="absolute top-0 bottom-0 left-0 right-0">
                  <Chat messages={gameData.chats} />
                </div>
              </div>
              <div className="flex-1 w-full h-full p-2 mt-6 bg-gray-100 rounded-lg">
                <Tabs defaultActiveKey="1">
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
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </Spin>
    </Layout>
  );
};

export default Match;
