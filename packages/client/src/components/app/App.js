/* eslint-disable no-unused-vars */
import { useEffect, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Auth } from 'pages';

import 'assets/css/tailwind.css';

import { Suspense } from 'react';
import Loading from 'components/Loading';
import { initUserLoading } from 'slices/user';
import ProtectedRoute from 'components/ProtectedRoute';
import { Main } from 'pages';

function App() {
  const dispatch = useDispatch();
  const isInit = useSelector((state) => state.init);
  useEffect(() => {
    (async function init() {
      await dispatch(initUserLoading());
    })();
  }, [dispatch]);
  return isInit ? (
    <Loading />
  ) : (
    <Router>
      <Suspense fallback={Loading}>
        <Switch>
          <ProtectedRoute exact path="/" component={Main} />
          <Route exact path="/login" component={Auth} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
