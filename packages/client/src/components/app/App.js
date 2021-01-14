/* eslint-disable no-unused-vars */
import { useEffect, lazy, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, notification } from 'antd';
import { ActiveAccount, Auth } from 'pages';
import socket from 'configs/socket';
import 'assets/css/tailwind.css';

import { Suspense } from 'react';
import Loading from 'components/Loading';
import { initUserLoading } from 'slices/user';

import ProtectedRoute from 'components/ProtectedRoute';
import { Main, Room } from 'pages';
import { addItem, removeItem } from 'slices/online';
import { Profile, ForgotPassword, Match } from 'pages';
import Wrapper from 'hoc/Wrapper';

function App() {
  const dispatch = useDispatch();
  const isInit = useSelector((state) => state.init);
  const error = useSelector((state) => state.error);

  useEffect(() => {
    (async function init() {
      await dispatch(initUserLoading());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

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
      <Wrapper>
        <Suspense fallback={Loading}>
          <Switch>
            <ProtectedRoute exact path="/" component={Main} />

            <Route exact path="/login" component={Auth} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/active-account" component={ActiveAccount} />
            <Route path="/profile/:id" component={Profile} />
            <Route path="/match/:id" component={Match} />

            <ProtectedRoute path="/:id" component={Room} />
          </Switch>
        </Suspense>
      </Wrapper>
    </Router>
  );
}

export default App;
