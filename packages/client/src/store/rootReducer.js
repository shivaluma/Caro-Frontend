import { combineReducers } from '@reduxjs/toolkit';

import userReducer from 'slices/user';
import initReducer from 'slices/init';
import { loadingSlice, profileSlice } from 'slices';

const rootReducer = combineReducers({
  user: userReducer,
  init: initReducer,
  loading: loadingSlice,
  profile: profileSlice,
});

export default rootReducer;
