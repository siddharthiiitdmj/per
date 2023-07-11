// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

import device from './apps/device'
import events from './apps/events'
import deviceSpecificEvents from './apps/deviceSpecificEvents'
import uniqueUsers from './apps/uniqueUsers'
import pieStats from './apps/pieStats'
import lineStats from './apps/lineStats'
import userSpecificEvents from './apps/userSpecificEvents'

export const store = configureStore({
  reducer: {
    device,
    events,
    deviceSpecificEvents,
    uniqueUsers,
    pieStats,
    lineStats,
    userSpecificEvents,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
