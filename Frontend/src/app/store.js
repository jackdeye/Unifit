import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../Auth/authSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
})