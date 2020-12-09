import { combineReducers } from '@reduxjs/toolkit';

import userReducer from 'slices/user';
import initReducer from 'slices/init';
import { loadingSlice, profileSlice, onlineSlice } from 'slices';

const rootReducer = combineReducers({
  user: userReducer,
  init: initReducer,
  loading: loadingSlice,
  profile: profileSlice,
  online: onlineSlice,
});

export default rootReducer;
