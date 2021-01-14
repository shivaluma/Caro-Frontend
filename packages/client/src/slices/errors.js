/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
  name: 'error',
  initialState: null,
  reducers: {
    change(state, action) {
      return action.payload.payload.error;
    }
  }
});

export const { change } = errorSlice.actions;

export default errorSlice.reducer;

// Actions

export const changeError = (error) => async (dispatch) => {
  dispatch(change({ payload: { error } }));
};
