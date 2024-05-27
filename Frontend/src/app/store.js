import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../Auth/authSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
  },
})