import React from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

import { useDispatch } from 'react-redux';
import { signin } from 'slices/user';

import { Link } from 'react-router-dom';
import { useLoading } from '../../hooks';

const LoginForm = ({ changeMode, redirect }) => {
  const { handleSubmit, register, errors, setError } = useForm();
  const [isLoading, changeLoading] = useLoading();
  const dispatch = useDispatch();

  // function sleep(ms) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

  const onSubmit = async (values) => {
    changeLoading();
    try {
      await dispatch(signin(values));
      changeLoading();
      redirect();
    } catch (err) {
      setError('password', {
        type: 'manual',
        message: err?.response?.data?.message || 'ERR: CONNECTION REFUSED.'
      });
      changeLoading();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <label htmlFor="email">
          <span className="px-0 mb-1 text-left tile-structure-name ">Email</span>
          <input
            name="email"
            id="email"
            className={clsx(
              'w-full p-2 border border-gray-230 rounded-md focus:outline-none',
              errors.name && 'border-red-500'
            )}
            ref={register({
              required: 'Required'
            })}
            autoComplete="on"
          />
        </label>
        {errors.email && (
          <span className="mt-1 text-xs font-medium text-red-600">{errors.email.message}</span>
        )}

        <label className="mt-4" htmlFor="password">
          <span className="px-0 mb-1 text-left tile-structure-name">Password</span>
          <input
            name="password"
            id="password"
            type="password"
            className={clsx(
              'w-full p-2 border border-gray-230 rounded-md focus:outline-none',
              errors.password && 'border-red-500'
            )}
            ref={register({
              required: 'Required'
            })}
            autoComplete="on"
          />
        </label>

        {errors.password && (
          <span className="mt-1 text-xs font-medium text-red-600">{errors.password.message}</span>
        )}

        <button
          className="mt-8 text-xs font-medium text-white border rounded-lg focus:outline-none bg-background-button"
          type="submit"
          disabled={isLoading}>
          <div className="flex items-center justify-center h-10">Log In</div>
        </button>

        <Link
          className="mt-3 font-medium text-center text-gray-400 cursor-pointer text-md hover:underline"
          to="/forgot-password">
          Forgot password?
        </Link>

        <span className="mt-4 text-xs text-center text-gray-400">
          Don&apos;t have an account?
          <button
            type="button"
            className="ml-2 text-background-button focus:outline-none"
            onClick={changeMode}>
            Sign Up
          </button>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
