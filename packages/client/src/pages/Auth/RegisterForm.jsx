import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

import { useDispatch } from 'react-redux';
import { Result } from 'antd';
import { signup } from 'slices/user';
import { useLoading } from '../../hooks';

const RegisterForm = ({ changeMode }) => {
  const { handleSubmit, register, errors, setError } = useForm();
  const [isRegisterSuccess, setRegisterSuccess] = useState(false);
  const [isLoading, changeLoading] = useLoading();
  const dispatch = useDispatch();
  // function sleep(ms) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

  const onSubmit = async (values) => {
    changeLoading();
    const response = await dispatch(signup(values));

    if (response && response.data.isError) {
      response.data.err.fields.forEach((field) =>
        setError(field, {
          type: 'manual',
          message: response.data.message,
        })
      );
    } else {
      setRegisterSuccess(true);
    }
    changeLoading();
  };

  return isRegisterSuccess ? (
    <Result
      status="success"
      title="Register Success"
      subTitle="You could login using your account right now."
      extra={[
        <button
          key="backtologin"
          type="button"
          className="px-3 py-2 text-white rounded-md bg-background-button"
          onClick={changeMode}>
          Back to login
        </button>,
      ]}
    />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <label htmlFor="username">
          <span className="px-0 mb-1 text-left tile-structure-name ">Username</span>
          <input
            name="username"
            id="username"
            className={clsx(
              'w-full p-2 border border-gray-230 rounded-md focus:outline-none',
              errors.username && 'border-red-500'
            )}
            ref={register({
              required: 'Required',
              pattern: {
                value: /^.{6,}$/i,
                message: 'Username must contain at least 6 characters.',
              },
            })}
            autoComplete="on"
          />
        </label>
        {errors.username && <span className="mt-1 text-xs font-medium text-red-600">{errors.username.message}</span>}

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
              required: 'Required',
              pattern: {
                value: /^.{6,}$/i,
                message: 'Password must contain at least 6 characters.',
              },
            })}
            autoComplete="on"
          />
        </label>

        {errors.password && <span className="mt-1 text-xs font-medium text-red-600">{errors.password.message}</span>}

        <label className="mt-4" htmlFor="confirmPassword">
          <span className="px-0 mb-1 text-left tile-structure-name">Confirm Password</span>
          <input
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            className={clsx(
              'w-full p-2 border border-gray-230 rounded-md focus:outline-none',
              errors.confirmPassword && 'border-red-500'
            )}
            ref={register({
              required: 'Required',
              pattern: {
                value: /^.{6,}$/i,
                message: 'Confirm password must contain at least 6 characters.',
              },
            })}
            autoComplete="on"
          />
        </label>

        {errors.confirmPassword && (
          <span className="mt-1 text-xs font-medium text-red-600">{errors.confirmPassword.message}</span>
        )}

        <button
          className="mt-8 text-xs font-medium text-white border rounded-lg focus:outline-none bg-background-button"
          type="submit"
          disabled={isLoading}>
          <div className="flex items-center justify-center h-10">Create Account</div>
        </button>

        <span className="mt-6 text-xs text-center text-gray-400">
          Already have an account?
          <button type="button" className="ml-2 text-background-button focus:outline-none" onClick={changeMode}>
            Login
          </button>
        </span>
      </div>
    </form>
  );
};

export default RegisterForm;
