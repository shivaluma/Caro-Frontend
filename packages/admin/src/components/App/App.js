import { Suspense, useEffect, useState } from 'react';
import { Spin } from 'antd';
import API from 'api';
import configureRoutes from 'routes';
import { renderRoutes } from 'react-router-config';
import 'antd/dist/antd.css';
import 'assets/main.css';
import { useUser } from 'context/configureContext';

function App() {
  const context = useUser();
  const [hasInit, setHasInit] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get('/me');
        context.dispatch({ type: 'UPDATE_USER', payload: { user: data?.data?.user } });
        // eslint-disable-next-line no-empty
      } catch (err) {
      } finally {
        setHasInit(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    hasInit && (
      <Suspense fallback={<Spin size="large" />}>
        {renderRoutes(configureRoutes({ isAuth: context.state.user !== null }))}
      </Suspense>
    )
  );
}

export default App;
