/* eslint-disable no-unused-vars */
import { useEffect, lazy, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Auth } from 'pages';
import socket from 'configs/socket';
import 'assets/css/tailwind.css';

import { Suspense } from 'react';
import Loading from 'components/Loading';
import { initUserLoading } from 'slices/user';
import ProtectedRoute from 'components/ProtectedRoute';
import { Main, Room } from 'pages';
import { addItem, removeItem } from 'slices/online';

function App() {
  const dispatch = useDispatch();
  const isInit = useSelector((state) => state.init);
  const user = useSelector((state) => state.user);
  const prevEmail = useRef(null);
  useEffect(() => {
    (async function init() {
      await dispatch(initUserLoading());
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    socket.on('user-change', ({ online, data }) => {
      if (online) {
        dispatch(addItem(data.email));
      } else {
        dispatch(removeItem(data.email));
      }
    });

    if (user && user.email) {
      const emitOffline = () => {
        socket.emit('user-offline', user);
      };

      window.onbeforeunload = (ev) => {
        ev.preventDefault();
        emitOffline();
      };
    }
  }, [dispatch, user]);

  return isInit ? (
    <Loading />
  ) : (
    <Router>
      <Suspense fallback={Loading}>
        <Switch>
          <ProtectedRoute exact path="/" component={Main} />
          <ProtectedRoute exact path="/id" component={Room} />
          <Route exact path="/login" component={Auth} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
