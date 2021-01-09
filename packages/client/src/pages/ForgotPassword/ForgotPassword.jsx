/* eslint-disable no-nested-ternary */
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { postForgotPassword, postChangeNewPassword } from 'services/user';
import { checkToken } from 'services/token';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = (props) => {
  const { register, handleSubmit, errors, setError } = useForm();
  const [customErrors, setCustomErrors] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState({ hasSet: false, isValid: true, hasChangedPassword: false });

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    setData((prev) => ({
      ...prev,
      email: params.get('email'),
      token: params.get('token'),
      hasSet: true
    }));
  }, [props.location.search]);

  const runRef = useRef(false);
  useEffect(() => {
    if (!runRef.current && data.token && data.email) {
      (async () => {
        runRef.current = true;
        try {
          await checkToken(data.email, data.token);
        } catch (e) {
          setData((prev) => ({ ...prev, isValid: false }));
        }
      })();
    }
  }, [data.token, data.email]);

  const onSubmit = async (values) => {
    setCustomErrors(() => null);

    try {
      const data = await postForgotPassword(values.email);
      setData((prev) => ({ ...prev, values }));
      setIsSuccess(true);
    } catch (err) {
      console.log(err.response);
      if (err.response.status === 404)
        setError('email', {
          type: 'manual',
          message: `The email ${values.email} was not found in out database.`
        });

      if (err.response.status === 500) setCustomErrors(`Server error: ${err.response.status}`);
    }
  };

  const onChangePassword = async (values) => {
    setCustomErrors(null);
    if (values.password !== values.confirmpassword) {
      setError('confirmpassword', {
        type: 'manual',
        message: `Confirm password do not match.`
      });

      return;
    }

    try {
      await postChangeNewPassword(values.password, data.token, data.email);
      setData((prev) => ({
        ...prev,
        hasChangedPassword: true
      }));
    } catch (err) {
      setCustomErrors('Cannot change password due to unknown error.');
    }
  };
  return (
    data.hasSet && (
      <div className="flex flex-col items-center justify-center h-screen gradient-background">
        <Link to="/login">
          <div className="flex items-center mb-6 -mt-12 text-3xl font-medium">
            <span className="text-xl">BrosCaro</span>
          </div>
        </Link>
        <div className="flex flex-col px-24 py-16 bg-white rounded-md">
          {data.hasChangedPassword && (
            <div className="flex flex-col items-center">
              <span className="mb-4 text-xl text-center text-gray-800">Password changed.</span>

              <Link to="/login">
                <span className="text-sm font-semibold text-center text-blue-500">
                  Back to login
                </span>
              </Link>
            </div>
          )}

          {!data.hasChangedPassword && (
            <>
              {!data.isValid && (
                <span className="mb-3 text-lg text-center text-red-600">
                  This token has been expired or it is an invalid token.
                </span>
              )}
              {data.isValid && data.token && data.email ? (
                <>
                  <span className="text-3xl text-center text-gray-800">Change Password</span>
                  <span className="mt-2 text-center">
                    for <span className="font-semibold text-gray-700">{data.email}</span>
                  </span>

                  {customErrors && (
                    <span className="py-3 text-xs font-semibold text-center text-red-400">
                      {customErrors}
                    </span>
                  )}
                  <form className="flex flex-col" onSubmit={handleSubmit(onChangePassword)}>
                    <span className="py-1 mt-8 text-xs font-semibold text-gray-500">Password</span>
                    <input
                      type="password"
                      name="password"
                      className={clsx(
                        'px-5 py-2 bg-white border border-gray-200 rounded-md w-96 focus:outline-none',
                        errors.password && 'border-red-500'
                      )}
                      ref={register({
                        required: 'Required',
                        pattern: {
                          value: /^.{6,}$/i,
                          message: 'Password is not valid (minlength 6).'
                        }
                      })}
                    />
                    {errors.password && (
                      <span className="mt-2 text-xs font-semibold text-red-500">
                        {errors.password.message}
                      </span>
                    )}

                    <span className="py-1 mt-6 text-xs font-semibold text-gray-500">
                      Confirm Password
                    </span>
                    <input
                      type="password"
                      name="confirmpassword"
                      className={clsx(
                        'px-5 py-2 bg-white border border-gray-200 rounded-md w-96 focus:outline-none',
                        errors.confirmpassword && 'border-red-500'
                      )}
                      ref={register({
                        required: 'Required',
                        pattern: {
                          value: /^.{6,}$/i,
                          message: 'Confirm passowrd is not valid (minlength 6).'
                        }
                      })}
                    />
                    {errors.confirmpassword && (
                      <span className="mt-2 text-xs font-semibold text-red-500">
                        {errors.confirmpassword.message}
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={errors.password || errors.confirmpassword}
                      className="px-4 py-3 mt-8 text-xs font-semibold text-white bg-blue-400 rounded-md flex-end focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400">
                      Change Password
                    </button>
                  </form>
                </>
              ) : !isSuccess ? (
                <>
                  <span className="text-3xl text-center text-gray-800">Forgot your password ?</span>

                  {customErrors && (
                    <span className="py-3 text-xs text-center text-red-400">{customErrors}</span>
                  )}

                  <span className="py-1 mt-8 text-xs font-semibold text-gray-500">
                    Email address
                  </span>
                  <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <input
                      type="email"
                      name="email"
                      className={clsx(
                        'px-5 py-2 bg-white border border-gray-200 rounded-md w-96 focus:outline-none',
                        errors.email && 'border-red-500'
                      )}
                      ref={register({
                        required: 'Required',
                        pattern: {
                          value: /\S+@\S+\.\S+/i,
                          message: 'Email is not valid.'
                        }
                      })}
                    />
                    {errors.email && (
                      <span className="mt-2 text-xs font-semibold text-red-500">
                        {errors.email.message}
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={errors.email}
                      className="px-4 py-3 mt-8 text-xs font-semibold text-white bg-blue-400 rounded-md flex-end focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400">
                      Send me instructions
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <span className="text-3xl text-center text-gray-800">Instruction Sent</span>

                  <span className="mt-6 text-sm text-center text-gray-600">
                    Instructions for resetting your password have been sent to{' '}
                    <span className="font-semibold text-gray-800">{data?.values?.email}</span>.
                  </span>

                  <span className="mt-6 text-sm text-center text-gray-600">
                    You’ll receive this email within 5 minutes. Be sure to check your spam folder,
                    too.
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </div>
    )
  );
};

export default ForgotPassword;
