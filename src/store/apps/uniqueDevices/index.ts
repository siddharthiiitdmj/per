// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  id: string
  OS: string
  q: string
  dates?: Date[]
}

// ** Fetch Users
export const fetchUniqueDevicesData = createAsyncThunk('appUniqueDevices/fetchUniqueDevicesData', async (params: DataParams) => {
  const response = await axios.get('/api/events/uniqueDevices',{
    params
  })
  
  return response.data
})

export const appUniqueDevicesSlice = createSlice({
  name: 'appUniqueDevices',
  initialState: {
    total: 1,
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUniqueDevicesData.fulfilled, (state, action) => {
      state.total = action.payload.total
      state.allData = action.payload.allData
    })
  }
})

export default appUniqueDevicesSlice.reducer
