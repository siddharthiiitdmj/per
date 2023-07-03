// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  OS: string
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appDevices/fetchData', async (params: DataParams) => {
  const {OS} = params
  const response = await axios.get(`/api/devices/data?os=${OS}`)

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
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.total = action.payload.total
      state.allData = action.payload.allData
    })
  }
})

export default appDevicesSlice.reducer
