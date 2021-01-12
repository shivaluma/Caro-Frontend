/* eslint-disable react/display-name */
import { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import { DashboardLayout, AuthLayout, ErrorLayout } from 'layouts';

const configureRoutes = ({ isAuth = false }) => {
  return [
    {
      path: '/',
      exact: true,
      component: () => <Redirect to="/users" />
    },
    {
      path: '/errors',
      component: ErrorLayout,
      routes: [
        {
          path: '/errors/error-404',
          exact: true,
          component: lazy(() => import('pages/Error404'))
        },

        {
          component: () => <Redirect to="/errors/error-404" />
        }
      ]
    },
    {
      path: '/auth',
      component: AuthLayout,
      routes: [
        {
          path: '/auth/login',
          exact: true,
          component: lazy(() => import('pages/Login'))
        },
        {
          component: () => <Redirect to="/errors/error-404" />
        }
      ]
    },
    {
      route: '*',
      title: 'Management',
      component: isAuth ? DashboardLayout : () => <Redirect to="/auth/login" />,
      private: true,
      routes: [
        {
          path: '/users',
          exact: true,
          component: lazy(() => import('pages/Users'))
        },
        {
          path: '/user/:id',
          exact: true,
          component: lazy(() => import('pages/User'))
        },
        {
          path: '/match/:id',
          exact: true,
          title: 'Match Management',
          component: lazy(() => import('pages/Match'))
        },
        {
          path: '/matchs',
          exact: true,
          title: 'Match Management',
          component: lazy(() => import('pages/Matchs'))
        }
      ]
    }
  ];
};

export default configureRoutes;
