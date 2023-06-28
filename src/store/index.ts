// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

import device from './apps/device'
import events from './apps/events'

export const store = configureStore({
  reducer: {
    device,
    events
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
