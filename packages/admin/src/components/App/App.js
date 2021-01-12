import { Suspense } from 'react';
import { Spin } from 'antd';

import configureRoutes from 'routes';
import { renderRoutes } from 'react-router-config';
import 'antd/dist/antd.css';
import 'assets/main.css';
import { useUser } from 'context/configureContext';

function App() {
  const context = useUser();

  return (
    <Suspense fallback={<Spin size="large" />}>
      {renderRoutes(configureRoutes({ isAuth: context.state.user !== null }))}
    </Suspense>
  );
}

export default App;
