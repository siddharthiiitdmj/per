// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  OS: string
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appEvents/fetchData', async (params: DataParams) => {
  const {OS} = params
  const response = await axios.get(`/api/events/data?os=${OS}`)

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
