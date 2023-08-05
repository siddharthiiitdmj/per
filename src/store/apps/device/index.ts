// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  OS: string
  q: string
}

// ** Fetch Users
export const fetchDeviceData = createAsyncThunk('appDevices/fetchDeviceData', async (params: DataParams) => {
  const response = await axios.get(`/api/devices/data`, {
    params
  })

  return response.data
})

export const appDevicesSlice = createSlice({
  name: 'appDevices',
  initialState: {
    total: 1,
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDeviceData.fulfilled, (state, action) => {
      state.total = action.payload.total
      state.allData = action.payload.allData
    })
  }
})

export default appDevicesSlice.reducer
