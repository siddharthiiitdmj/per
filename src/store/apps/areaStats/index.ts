// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  OS: string
}

// ** Fetch Users
export const fetchAreaStatsData = createAsyncThunk('appAreaStats/fetchData', async (params: DataParams) => {
  console.log(params)
  const response = await axios.get('/api/devices/stats4?chart=lineChart', {
    params
  })

  return response.data
})

export const appAreaStatsSlice = createSlice({
  name: 'appAreaStats',
  initialState: {
    areaChartData: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAreaStatsData.fulfilled, (state, action) => {
      console.log(action.payload)

      state.areaChartData = action.payload
    })
  }
})

export default appAreaStatsSlice.reducer