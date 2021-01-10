/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Spin, Result } from 'antd';
import { Link } from 'react-router-dom';
import { putActiveAccount } from 'services/user';

const ForgotPassword = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  useEffect(() => {
    if (props.location.search) {
      const params = new URLSearchParams(props.location.search);
      setData(() => ({ email: params.get('email'), token: params.get('token') }));
    }
  }, [props.location.search]);

  useEffect(() => {
    if (data?.email && data?.token) {
      console.log('run');
      (async () => {
        try {
          await putActiveAccount(data.token, data.email);
          setData((prev) => ({ ...prev, status: 'done' }));
        } catch (err) {
          console.log(err.response);
          setData((prev) => ({ ...prev, status: 'error' }));
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [data?.token, data?.email]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gradient-background">
      <Link to="/login">
        <div className="flex items-center mb-6 -mt-12 text-3xl font-medium">
          <span className="text-xl text-white">BrosCaro</span>
        </div>
      </Link>
      {data && data.email && data.token && (
        <div className="flex flex-col px-24 py-16 bg-white rounded-md">
          <span className="text-3xl text-center text-gray-800">Active Account</span>

          <span className="mt-5 text-center">
            <Spin spinning={loading} />
          </span>
          <span className="mb-2 text-center text-md">
            Hi, <span className="font-semibold text-blue-600">{data.email}</span>
          </span>
          {!data.status && (
            <span className="text-xs">Please wait we are activating your account</span>
          )}

          {data.status === 'done' && (
            <Result
              status="success"
              title="Active account successfully!"
              subTitle="You can login and play right now."
              extra={[
                <Link key="backtologin" to="/login">
                  <span
                    type="button"
                    className="px-3 py-2 text-white rounded-md bg-background-button">
                    Back to login
                  </span>
                </Link>
              ]}
            />
          )}

          {data.status === 'error' && (
            <Result
              status="error"
              title="Cannot active your account!"
              subTitle="Maybe the token expired? Are you provided us a valid token?"
              extra={[
                <Link key="backtologin" to="/login">
                  <span
                    type="button"
                    className="px-3 py-2 text-white rounded-md bg-background-button">
                    Back to login
                  </span>
                </Link>
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
