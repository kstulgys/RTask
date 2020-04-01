import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit'
import {getDataPoints} from 'api/currenciesAPI'
import {RootState} from 'app/store'

const fetchDataPoints: any = createAsyncThunk(
  'app/fetchDataPointsStatus',
  async ({selectedFrom, selectedTo}: {selectedFrom: string; selectedTo: string}, thunkAPI) => {
    const dataPoints = await getDataPoints({selectedTo, selectedFrom})
    return dataPoints
  },
)

type DataPoints = {x: number; y: number}[]

interface InitialState {
  isLoading: boolean
  dataPoints: DataPoints | null
  message: {text?: string; type?: string}
}
const initialState: InitialState = {
  isLoading: true,
  dataPoints: null,
  message: {},
}

const dataPointsReducer = createSlice({
  name: 'dataPoints',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchDataPoints.pending]: state => {
      state.isLoading = true
    },
    [fetchDataPoints.fulfilled]: (state, action: PayloadAction<DataPoints>) => {
      state.isLoading = false
      state.dataPoints = action.payload
      state.message = {}
    },
    [fetchDataPoints.rejected]: (state, action) => {
      state.isLoading = false
      state.dataPoints = null
      state.message = {text: `Could not get current rate.`, type: 'warning'}
    },
  },
})

export default dataPointsReducer.reducer
export {fetchDataPoints}
export const dataPointsSelector = (state: RootState) => state.dataPoints
