// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  OS: string
  q: string
  dates?: Date[]
  source?: string
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appEvents/fetchData', async (params: DataParams) => {
  const response = await axios.get('/api/events/data', {
    params
  })

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
