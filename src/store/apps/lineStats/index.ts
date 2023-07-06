// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  OS: string
}

// ** Fetch Users
export const fetchLineStatsData = createAsyncThunk('appLineStats/fetchData', async (params: DataParams) => {
  console.log(params)
  const response = await axios.get('/api/devices/stats',{
    params
  })

  return response.data
})

export const appLineStatsSlice = createSlice({
  name: 'appLineStats',
  initialState: {
    lineChartData: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchLineStatsData.fulfilled, (state, action) => {
      state.lineChartData = action.payload.lineChartData
    })
  }
})

export default appLineStatsSlice.reducer
