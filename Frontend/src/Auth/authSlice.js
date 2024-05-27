import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    value: false,
  },
  reducers: {
    loginSuccess: (state) => {
      state.value = true;
    },
    logout: (state) => {
      state.value = false;
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions

export default authSlice.reducer