import { createContext, useReducer, useMemo, useContext } from 'react';

const AuthContext = createContext(null);

const initialState = {
  user: null
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_USER': {
      return {
        ...state,
        user: action.payload.user
      };
    }

    case 'REMOVE_USER': {
      return {
        ...state,
        user: null
      };
    }

    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUser = () => useContext(AuthContext);

export default AuthProvider;
