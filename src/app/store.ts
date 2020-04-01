import {configureStore, Action, combineReducers} from '@reduxjs/toolkit'
import {ThunkAction} from 'redux-thunk'
import currenciesReducer from 'app/features/currencies/currenciesSlice'
import currentRateReducer from 'app/features/currentRate/currentRateSlice'
import dataPointsReducer from 'app/features/dataPoints/dataPointsSlice'
import inputChangeReducer from 'app/features/inputChange/inputChangeSlice'
import selectCurrencyReducer from 'app/features/selectCurrency/selectCurrencySlice'

export const rootReducer = combineReducers({
  currencies: currenciesReducer,
  currentRate: currentRateReducer,
  dataPoints: dataPointsReducer,
  inputChange: inputChangeReducer,
  selectCurrency: selectCurrencyReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
export const currenciesSelector = (state: RootState) => state.currencies
export const currentRateSelector = (state: RootState) => state.currentRate
export const dataPointsSelector = (state: RootState) => state.dataPoints
export const inputChangeSelector = (state: RootState) => state.inputChange
export const selectCurrencySelector = (state: RootState) => state.selectCurrency

export default store
