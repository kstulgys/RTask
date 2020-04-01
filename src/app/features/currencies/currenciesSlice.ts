import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit'
import {Currencies} from 'app/types'
import {getCurrencies} from 'api/currenciesAPI'
import {RootState} from 'app/store'

const fetchCurrencies: any = createAsyncThunk('app/fetchCurrenciesStatus', async (_, thunkAPI) => {
  const currencies = await getCurrencies()
  return currencies
})

interface InitialState {
  isLoading: boolean
  currencies: Currencies
  message: {text?: string; type?: string}
}
const initialState: InitialState = {
  isLoading: true,
  currencies: [],
  message: {},
}

const currenciesReducer = createSlice({
  name: 'currencies',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCurrencies.pending]: state => {
      state.isLoading = true
      state.message = {}
    },
    [fetchCurrencies.fulfilled]: (state, action: PayloadAction<Currencies>) => {
      state.isLoading = false
      state.currencies = action.payload
      state.message = {}
    },
    [fetchCurrencies.rejected]: (state, action) => {
      state.isLoading = false
      state.message = {text: `Something went wrong.`, type: 'warning'}
    },
  },
})

export default currenciesReducer.reducer
export {fetchCurrencies}
export const currenciesSelector = (state: RootState) => state.currencies
