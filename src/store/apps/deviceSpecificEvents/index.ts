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
export const fetchData = createAsyncThunk('deviceSpecificEvents/fetchData', async (params: DataParams) => {
  const response = await axios.get('/api/events/deviceSpecificData',{
    params
  })

  return response.data
})

export const deviceSpecificEventsSlice = createSlice({
  name: 'deviceSpecificEvents',
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

export default deviceSpecificEventsSlice.reducer
