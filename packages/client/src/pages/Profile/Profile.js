import { Avatar } from 'antd';
import { ImTrophy } from 'react-icons/im';
import { useLayout } from 'hooks';
import { useMemo, useEffect, useState } from 'react';
import { UserService } from 'services';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';

const Profile = (props) => {
  const history = useHistory();
  const Layout = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLayout({
        // eslint-disable-next-line react/display-name
        left: () => (
          <div className="flex">
            <div key="leftHeader" className="ml-2 text-lg font-medium text-gray-800">
              Profile
            </div>
          </div>
        )
      }),
    []
  );

  const [user, setUser] = useState(null);
  const [games, setGames] = useState(null);

  useEffect(() => {
    if (!props.match.params.id) return;
    (async () => {
      try {
        const profileData = await UserService.getProfile(props.match.params.id);
        setUser(profileData);
      } catch (error) {
        console.log(error);
      }

      try {
        const gamesData = await UserService.getGameProfile(props.match.params.id);
        setGames(gamesData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [props.match.params.id]);

  return (
    <Layout>
      {user && (
        <>
          <div className="flex">
            <div className="flex flex-col items-center mx-auto mt-12">
              <div className="flex items-center justify-center avatar-border">
                <Avatar
                  size={128}
                  src="https://cdn.dribbble.com/users/4557429/avatars/small/open-uri20191213-19471-145569c?1576296398"
                />
              </div>

              <span className="mt-5 text-2xl">{user.email}</span>

              <span className="flex mt-5 text-4xl text-yellow-500">
                <ImTrophy className="mr-2" />
                {user.point || 0}
              </span>
              <div className="flex mt-5 text-xl font-semibold">
                <span className="text-green-600">{user.wincount || 0}W</span>
                <span className="ml-16 text-gray-600">{user.drawcount || 0}D</span>
                <span className="ml-16 text-red-600">{user.losecount || 0}L</span>
                <span className="ml-16 text-blue-600">
                  {(user.wincount / (user.drawcount + user.wincount + user.losecount)).toFixed(2) *
                    100}
                  % WR
                </span>
              </div>
            </div>
          </div>

          <div className="w-full my-12">
            <div className="container">
              <span className="pl-2 text-2xl border-l-4 border-gray-400 text-bold">
                Recent games
              </span>

              {games &&
                games.map((game) => (
                  <button
                    onClick={() => history.push(`/match/${game._id}`)}
                    type="button"
                    key={game._id}
                    className="flex items-center p-6 mt-3 bg-gray-100 rounded-lg focus:outline-none">
                    <span
                      className={clsx(
                        'px-3 py-2 font-semibold text-white rounded-md',
                        // eslint-disable-next-line no-nested-ternary
                        user._id === game.winner._id
                          ? 'bg-green-600'
                          : game.winner
                          ? 'bg-red-600'
                          : 'bg-yellow-600'
                      )}>
                      {
                        // eslint-disable-next-line no-nested-ternary
                        user._id === game.winner._id ? 'WIN' : game.winner ? 'LOSE' : 'DRAW'
                      }
                    </span>
                    <span className="flex items-center ml-12 font-semibold text-gray-500">
                      VS{' '}
                      <span className="ml-3 text-xl font-bold text-black">
                        {user._id !== game.firstPlayer._id
                          ? game.firstPlayer.email
                          : game.secondPlayer.email}
                      </span>
                    </span>
                    <span className="ml-auto text-lg text-gray-700"> 1 day ago.</span>
                  </button>
                ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Profile;
