// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

import device from './apps/device'
import events from './apps/events'
import deviceSpecificEvents from './apps/deviceSpecificEvents'
import uniqueUsers from './apps/uniqueUsers'

export const store = configureStore({
  reducer: {
    device,
    events,
    deviceSpecificEvents,
    uniqueUsers
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
