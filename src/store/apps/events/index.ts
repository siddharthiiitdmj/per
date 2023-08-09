// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  OS: string
  q: string
  startDate?: Date
  endDate?: Date
  source?: string
  page?: number
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appEvents/fetchData', async (params: DataParams) => {
  console.log('params:')
  console.log(params)

  const response = await axios.get(`/api/devices/all?page=${params.page}`, {
    params
  })

  return response.data
})

export const appEventsSlice = createSlice({
  name: 'appEvents',
  initialState: {
    total: 1,
    currPageData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.total = action.payload.totalCount
      state.currPageData = action.payload.events
    })
  }
})

export default appEventsSlice.reducer
