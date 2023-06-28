// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// interface DataParams {
//   userId: string
//   deviceId: string
//   nodename: string
//   IPaddress: string
//   isVPNSpoofed: boolean | undefined
//   isVirtualOS: boolean | undefined 
//   isEmulator: boolean | undefined
//   isAppSpoofed: boolean | undefined
//   isAppPatched: boolean | undefined
//   isAppCloned: boolean | undefined
//   Latitude: string
//   Longitude: string
//   Cellular_network: string
//   Wifi_network: string
//   createdAt: string
//   updatedAt: string
// }

// ** Fetch Users
export const fetchData = createAsyncThunk('appEvents/fetchData', async () => {
  const response = await axios.get('/api/events/data')

  return response.data
})

export const appEventsSlice = createSlice({
  name: 'appEvents',
  initialState: {
    total: 1,
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.total = action.payload.total
      state.allData = action.payload.allData
    })
  }
})

export default appEventsSlice.reducer
