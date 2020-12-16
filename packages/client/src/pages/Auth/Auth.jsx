import { Spin } from 'antd';
import React, { useState, useCallback } from 'react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import { signinFacebook, signinGoogle } from 'slices/user';
import Logo from '../../components/Logo';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Login = ({ isLogin = true, location }) => {
  const isLoading = useSelector((state) => state.loading);
  const [isLoginMode, setLoginMode] = useState(() => isLogin);
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState(null);
  const onLoginSuccess = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const next = params.get('next') || '/';
    history.replace(next);
  }, [history, location.search]);

  const facebookLoginHandler = async (response) => {
    try {
      if (response.id && response.accessToken) {
        const err = await dispatch(
          signinFacebook({
            id: response.id,
            fbAccessToken: response.accessToken
          })
        );
        if (!err) onLoginSuccess();
        else throw err;
      }
    } catch (err) {
      setError(err.data.message);
    }
  };

  const googleLoginHandler = async (response) => {
    try {
      if (response.accessToken) {
        const err = await dispatch(
          signinGoogle({
            ggAccessToken: response.accessToken
          })
        );
        if (!err) onLoginSuccess();
        else throw err;
      }
    } catch (err) {
      setError(err.data.message);
    }
  };

  const handleChangeMode = () => setLoginMode((prev) => !prev);

  return (
    <div className="flex flex-col items-center min-h-screen bg-background-1">
      <div className="w-full px-5">
        <Spin spinning={isLoading}>
          <div className="mx-auto bg-white login-content">
            <div className="relative flex items-center justify-center w-auto p-3 mb-8 bg-main rounded-xl">
              <Logo className="absolute left-0 w-8 h-8 ml-5 rounded-sm" />
              <span className="ml-3 text-lg text-text-1">Caro Vjp Pro</span>
            </div>
            <div className="flex flex-col w-auto">
              <span className="mb-5 text-xl text-center text-text-1">Login by Socials</span>
              <div className="flex flex-col w-full gap-0 md:gap-5 md:flex-row">
                <GoogleLogin
                  clientId="796130238984-hu68ntsbb3vo0udf8tsdpj8la7reej1g.apps.googleusercontent.com"
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="flex items-center flex-1 px-12 py-4 text-red-700 transition-all duration-300 border rounded-lg border-gray-230 hover:bg-red-700 hover:text-white focus:outline-none"
                      onClick={renderProps.onClick}>
                      <FaGoogle />
                      <span className="ml-2">Google</span>
                    </button>
                  )}
                  buttonText="Login"
                  onSuccess={googleLoginHandler}
                  onFailure={googleLoginHandler}
                  cookiePolicy="single_host_origin"
                />

                <FacebookLogin
                  appId="763599140852000"
                  callback={facebookLoginHandler}
                  render={(props) => (
                    <button
                      type="button"
                      className="flex items-center flex-1 px-12 py-4 mt-4 text-blue-700 transition-all duration-300 border rounded-lg md:mt-0 border-gray-230 hover:bg-blue-700 hover:text-white focus:outline-none"
                      onClick={props.onClick}>
                      <FaFacebookF />
                      <span className="ml-2">Facebook</span>
                    </button>
                  )}
                />
              </div>

              {error && (
                <span className="mt-4 text-xs text-red-600 capitalize text-medium ">{error}</span>
              )}

              <div className="flex items-center justify-center my-6">
                <div className="flex-1 border-t border-gray-300" />
                <span className="px-1 text-gray-300">or</span>
                <div className="flex-1 border-t border-gray-300" />
              </div>

              {isLoginMode ? (
                <LoginForm redirect={onLoginSuccess} changeMode={handleChangeMode} />
              ) : (
                <RegisterForm changeMode={handleChangeMode} />
              )}
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
};
export default Login;
