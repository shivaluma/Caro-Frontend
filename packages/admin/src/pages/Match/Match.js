import { useState, useEffect } from 'react';
import { Tag, Avatar, Spin } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import API from 'api';
import { Board } from './components';

const Match = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [matchc, setMatchc] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/match/${match.params.id}`);
        console.log(data);
        setMatchc(data.data);
        // eslint-disable-next-line no-empty
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Spin spinning={loading}>
      {matchc && (
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col">
            <div className="flex justify-center flex-1 mb-3">
              <div className="relative flex flex-col items-center mr-8">
                <Avatar
                  size={64}
                  src="https://i.pinimg.com/474x/58/36/63/583663b5e293ac71fab5ad283b627320.jpg"
                />
                {matchc?.firstPlayer?._id === matchc?.winner?._id ? (
                  <Tag className="mt-2" color="#87d068">
                    Win
                  </Tag>
                ) : (
                  <Tag className="mt-2" color="#f50">
                    Lose
                  </Tag>
                )}
                <div className="flex">
                  <span className="font-semibold">{matchc.firstPlayer.displayName}</span>
                </div>
                <span className="absolute top-0 right-0 text-xl font-bold text-red-600">X</span>
                <span className="flex items-center font-semibold ">
                  {matchc.firstPlayer.wincount}W {matchc.firstPlayer.drawcount}D{' '}
                  {matchc.firstPlayer.losecount}L
                </span>
                <span className="flex items-center font-semibold text-yellow-500">
                  <TrophyOutlined /> {matchc.firstPlayer.point}
                </span>
              </div>

              <div className="relative flex flex-col items-center ml-8">
                <Avatar
                  size={64}
                  src="https://i.pinimg.com/474x/58/36/63/583663b5e293ac71fab5ad283b627320.jpg"
                />
                {matchc?.secondPlayer?._id === matchc?.winner?._id ? (
                  <Tag className="mt-2" color="#87d068">
                    Win
                  </Tag>
                ) : (
                  <Tag className="mt-2" color="#f50">
                    Lose
                  </Tag>
                )}
                <div className="flex">
                  <span className="font-semibold">{matchc.secondPlayer.displayName}</span>
                </div>

                <span className="absolute top-0 right-0 text-xl font-bold text-blue-600">O</span>

                <span className="flex items-center font-semibold ">
                  {matchc.secondPlayer.wincount}W {matchc.secondPlayer.drawcount}D{' '}
                  {matchc.secondPlayer.losecount}L
                </span>
                <span className="flex items-center font-semibold text-yellow-500">
                  <TrophyOutlined /> {matchc.secondPlayer.point}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 px-3 mx-2 ml-4 bg-gray-800 rounded-lg">
              <div className="p-3 play-area">
                <Board board={matchc?.board} />
              </div>
            </div>
          </div>

          <div className="flex lg:ml-12 lg:h-auto h-80">
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Chats</span>

              <div className="relative flex flex-col flex-1 mt-4 bg-gray-100 rounded-lg w-80">
                <div className="absolute top-0 bottom-0 left-0 right-0 p-3 overflow-y-auto ">
                  <div className="flex flex-col w-full h-full p-2 overflow-y-auto">
                    {matchc.chats.map((message, index) => (
                      <span key={index} className="p-1 font-medium">
                        {message.sender} :{' '}
                        <span className="text-sm font-normal text-gray-600">
                          {' '}
                          {message.content}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex lg:ml-12 lg:h-auto h-80">
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Moves</span>

              <div className="relative flex flex-col flex-1 mt-4 bg-gray-100 rounded-lg w-80 ">
                <div className="absolute top-0 bottom-0 left-0 right-0 p-3 overflow-y-auto ">
                  <div className="flex flex-col w-full h-full p-2 overflow-y-auto">
                    {matchc.move
                      .filter((el) => el !== null)
                      .map((move, index) => (
                        <span key={index} className="p-1 font-medium">
                          {index + 1} :{' '}
                          <span className="ml-6 text-sm font-semibold text-gray-600">
                            {' '}
                            col {move[0]} - row {move[1]}
                          </span>
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Spin>
  );
};

export default Match;
