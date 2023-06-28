// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  userId: String
  deviceId: String
  nodename: String
  IPaddress: String
  isVPNSpoofed: Boolean | undefined
  isVirtualOS: Boolean | undefined 
  isEmulator: Boolean | undefined
  isAppSpoofed: Boolean | undefined
  isAppPatched: Boolean | undefined
  isAppCloned: Boolean | undefined
  Latitude: String
  Longitude: String
  Cellular_network: String
  Wifi_network: String
  createdAt: String
  updatedAt: String
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appEvents/fetchData', async (params: DataParams) => {
  const response = await axios.get('/api/events/data')
  console.log(response.data)
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
