/* eslint-disable no-unused-vars */
import { useEffect, lazy, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'antd';
import { ActiveAccount, Auth } from 'pages';
import socket from 'configs/socket';
import 'assets/css/tailwind.css';

import { Suspense } from 'react';
import Loading from 'components/Loading';
import { initUserLoading } from 'slices/user';

import ProtectedRoute from 'components/ProtectedRoute';
import { Main, Room } from 'pages';
import { addItem, removeItem } from 'slices/online';
import { Profile, ForgotPassword } from 'pages';

function App() {
  const dispatch = useDispatch();
  const isInit = useSelector((state) => state.init);
  const user = useSelector((state) => state.user);
  const error = useSelector((state) => state.error);
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

  useEffect(() => {
    if (error) {
      Modal.error({
        title: 'Session error',
        content: error
      });
    }
  }, [error]);

  return isInit ? (
    <Loading />
  ) : (
    <Router>
      <Suspense fallback={Loading}>
        <Switch>
          <ProtectedRoute exact path="/" component={Main} />

          <Route exact path="/login" component={Auth} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/active-account" component={ActiveAccount} />
          <Route path="/profile/:id" component={Profile} />

          <ProtectedRoute path="/:id" component={Room} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
