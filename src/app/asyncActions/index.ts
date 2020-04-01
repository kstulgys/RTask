import {createAsyncThunk} from '@reduxjs/toolkit'
import {getCurrencies, getCurrentRate, getDataPoints, updatePockets, UpdatePocketsProps} from 'api/currenciesAPI'
import {getSelected, getCurrenciesFromStorage} from 'utils/helpers'

const fetchCurrencies: any = createAsyncThunk('app/fetchCurrenciesStatus', async (_, thunkAPI) => {
  const defaultFrom = 'GBP'
  const defaultTo = 'USD'

  // const {currencyFrom, currencyTo} = getCurrenciesFromStorage()
  const currencyFrom = null
  const currencyTo = null

  const currencies = await getCurrencies()
  const currentRate = await getCurrentRate({
    selectedFrom: currencyFrom ? currencyFrom : defaultFrom,
    selectedTo: currencyTo ? currencyTo : defaultTo,
  })
  const dataPoints = await getDataPoints({
    selectedFrom: currencyFrom ? currencyFrom : defaultFrom,
    selectedTo: currencyTo ? currencyTo : defaultTo,
  })
  const selectedFrom = getSelected(currencyFrom ? currencyFrom : defaultFrom, currencies)
  const selectedTo = getSelected(currencyTo ? currencyTo : defaultTo, currencies)

  return {
    currencies,
    currentRate,
    dataPoints,
    selectedFrom,
    selectedTo,
  }
})

const fetchCurrentRate: any = createAsyncThunk(
  'app/fetchCurrentRateStatus',
  async ({selectedFrom, selectedTo}: {selectedFrom: string; selectedTo: string}, thunkAPI) => {
    const currentRate = await getCurrentRate({selectedFrom, selectedTo})
    return currentRate
  },
)

const fetchDataPoints: any = createAsyncThunk(
  'app/fetchDataPointsStatus',
  async ({selectedFrom, selectedTo}: {selectedFrom: string; selectedTo: string}, thunkAPI) => {
    const dataPoints = await getDataPoints({selectedTo, selectedFrom})
    return dataPoints
  },
)

const submitValues: any = createAsyncThunk(
  'app/submitValuesStatus',
  async ({selectedFrom, selectedTo}: UpdatePocketsProps, thunkAPI) => {
    await updatePockets({selectedFrom, selectedTo})
  },
)

export {fetchDataPoints, fetchCurrentRate, fetchCurrencies, submitValues}
