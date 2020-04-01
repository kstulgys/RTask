import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit'
import {getCurrentRate} from 'api/currenciesAPI'
import {RootState} from 'app/store'

const fetchCurrentRate: any = createAsyncThunk(
  'app/fetchCurrentRateStatus',
  async ({selectedFrom, selectedTo}: {selectedFrom: string; selectedTo: string}, thunkAPI) => {
    const currentRate = await getCurrentRate({selectedFrom, selectedTo})
    return currentRate
  },
)

interface InitialState {
  isLoading: boolean
  currentRate: number
  message: {text?: string; type?: string}
}
const initialState: InitialState = {
  isLoading: true,
  currentRate: 0,
  message: {},
}

const currentRateReducer = createSlice({
  name: 'currentRate',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCurrentRate.pending]: state => {
      state.isLoading = true
      state.message = {}
    },
    [fetchCurrentRate.fulfilled]: (state, action: PayloadAction<number>) => {
      state.isLoading = false
      state.currentRate = action.payload
      state.message = {}
    },
    [fetchCurrentRate.rejected]: (state, action) => {
      state.isLoading = false
      state.currentRate = 0
      state.message = {text: `Could not get current rate.`, type: 'warning'}
    },
  },
})

export default currentRateReducer.reducer
export {fetchCurrentRate}
export const currentRateSelector = (state: RootState) => state.currentRate
