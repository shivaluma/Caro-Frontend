/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state.user);

  return (
    <Route
      {...rest}
      render={
        (props) =>
          user === null ? (
            <Redirect
              to={{
                pathname: '/login',
                search: `?next=${rest.location.pathname || '/'}`,
              }}
            />
          ) : (
            <Component {...props} />
          )
        // eslint-disable-next-line react/jsx-curly-newline
      }
    />
  );
};

export default ProtectedRoute;
