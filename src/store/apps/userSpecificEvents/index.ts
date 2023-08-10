// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  id: string
  OS?: string
  q?: string
  dates?: Date[]
}

// ** Fetch Users
export const fetchUserSpecificEventsData = createAsyncThunk(
  'userSpecificEvents/fetchUserSpecificEventsData',
  async (params: DataParams) => {
    const response = await axios.get('/api/events/userSpecificData', {
      params
    })

    return response.data
  }
)

export const userSpecificEventsSlice = createSlice({
  name: 'userSpecificEvents',
  initialState: {
    total: 1,
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUserSpecificEventsData.fulfilled, (state, action) => {
      state.total = action.payload.total
      state.allData = action.payload.allData
    })
  }
})

export default userSpecificEventsSlice.reducer
