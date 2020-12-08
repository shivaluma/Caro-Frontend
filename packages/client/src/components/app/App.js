/* eslint-disable no-unused-vars */
import { useEffect, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Auth } from 'pages';

import 'assets/css/tailwind.css';

import { Suspense } from 'react';
import Loading from 'components/Loading';

function App() {
  return (
    <Router>
      <Suspense fallback={Loading}>
        <Switch>
          <Route exact path="/login" component={Auth} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
