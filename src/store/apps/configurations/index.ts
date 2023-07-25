// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  OS: string
}

// ** Fetch Users
export const fetchPieStatsData = createAsyncThunk('appPieStats/fetchData', async (params: DataParams) => {
  console.log(params)
  const response = await axios.get('/api/devices/stats4?chart=pieChart', {
    params
  })

  return response.data
})

export const appPieStatsSlice = createSlice({
  name: 'appPieStats',
  initialState: {
    pieChartData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchPieStatsData.fulfilled, (state, action) => {
      state.pieChartData = action.payload
    })
  }
})

export default appPieStatsSlice.reducer
