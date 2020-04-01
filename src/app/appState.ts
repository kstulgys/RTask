import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {fetchDataPoints, fetchCurrentRate, fetchCurrencies, submitValues} from 'app/asyncActions'
import {Currencies, CurrencyState, Currency, DataPoints} from 'app/types'
import {AppThunk, RootState} from 'app/store'
import {
  getCanSubmit,
  isValidInput,
  getInputValueTo,
  getInputValueFrom,
  getPocketValueTo,
  getPocketValueFrom,
} from 'utils/helpers'

export const initialState: CurrencyState = {
  isSubmitting: false,
  pocketValueFrom: '',
  pocketValueTo: '',
  inputValueFrom: '',
  inputValueTo: '',
  canSubmit: false,
  selectedFrom: undefined,
  selectedTo: undefined,
  currencies: {
    isLoading: true,
    value: [],
    message: null,
  },
  dataPoints: {
    isLoading: true,
    value: [],
    message: null,
  },
  currentRate: {
    isLoading: true,
    value: 0,
    message: null,
  },
  message: null,
}

interface GetCurrenciesSuccessPayload {
  currencies: Currencies
  currentRate: number
  dataPoints: DataPoints
  selectedFrom: Currency | undefined
  selectedTo: Currency | undefined
}

const appReducer = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // handle update
    handleStateUpdate(state) {
      if (!state.selectedTo || !state.currentRate) return
      state.inputValueTo = getInputValueTo(state.inputValueFrom, state.currentRate.value)
      state.pocketValueTo = getPocketValueTo(state.selectedTo.value, state.inputValueTo)
    },
    // handle change
    handleInputChangeFrom(state, action: PayloadAction<string>) {
      if (!state.selectedFrom || !state.selectedTo || !state.currentRate || !isValidInput(action.payload)) return
      state.inputValueTo = getInputValueTo(action.payload, state.currentRate.value)
      state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, action.payload)
      state.pocketValueTo = getPocketValueTo(state.selectedTo.value, state.inputValueTo)
      state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: action.payload})
      state.inputValueFrom = action.payload
    },
    handleInputChangeTo(state, action: PayloadAction<string>) {
      if (!state.selectedTo || !state.selectedFrom || !state.currentRate || !isValidInput(action.payload)) return
      state.inputValueTo = action.payload
      state.inputValueFrom = getInputValueFrom(state.inputValueTo, state.currentRate.value)
      state.pocketValueTo = getPocketValueTo(state.selectedTo.value, action.payload)
      state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, state.inputValueFrom)
      state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: state.inputValueFrom})
    },
    handleSelectFrom(state, action: PayloadAction<Currency>) {
      if (!state.selectedTo) return
      state.selectedFrom = action.payload
      state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, state.inputValueFrom)
      state.canSubmit = getCanSubmit({
        pocketValueFrom: state.pocketValueFrom,
        inputValueFrom: state.inputValueFrom,
      })
    },
    handleSelectTo(state, action: PayloadAction<Currency>) {
      state.selectedTo = action.payload
      state.pocketValueTo = getPocketValueTo(state.selectedTo.value, state.inputValueTo)
    },
    handleSwapCurrencies(state) {
      if (!state.selectedTo) return
      const selectedTo = state.selectedFrom
      const selectedFrom = state.selectedTo
      state.selectedTo = selectedTo
      state.selectedFrom = selectedFrom
      state.inputValueFrom = state.inputValueTo
      state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, state.inputValueFrom)
      state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: state.inputValueFrom})
    },
  },
  extraReducers: {
    // CURRENCIES
    [fetchCurrencies.pending]: (state, action) => {
      // state.currencies.isLoading = true
      state.currencies.value = []
      state.currencies.message = null
    },
    [fetchCurrencies.fulfilled]: (state, action: PayloadAction<GetCurrenciesSuccessPayload>) => {
      const {currencies, currentRate, dataPoints, selectedFrom, selectedTo} = action.payload
      if (!selectedFrom || !selectedTo) return
      state.currentRate.value = currentRate
      state.dataPoints.value = dataPoints
      state.selectedFrom = selectedFrom
      state.selectedTo = selectedTo
      state.pocketValueFrom = selectedFrom.value.toString()
      state.pocketValueTo = selectedTo.value.toString()
      state.currencies.value = currencies
      state.currencies.isLoading = false
      state.currencies.message = null
      state.inputValueFrom = ''
      state.inputValueTo = ''
    },
    [fetchCurrencies.rejected]: (state, action) => {
      state.currencies.isLoading = false
      state.currencies.value = []
      state.currencies.message = {text: `Could not get currency list. Try again later.`, type: 'warning'}
    },
    // CURRENT RATE
    [fetchCurrentRate.pending]: (state, action) => {
      state.currentRate.isLoading = true
      state.currentRate.message = null
    },
    [fetchCurrentRate.fulfilled]: (state, action: PayloadAction<number>) => {
      state.currentRate.value = action.payload
      state.currentRate.message = null
      state.currentRate.isLoading = false
    },
    [fetchCurrentRate.rejected]: (state, action) => {
      state.currentRate.isLoading = false
      state.currentRate.value = 0
      state.currentRate.message = {text: `Could not get current rate.`, type: 'warning'}
    },
    // DATA POINTS
    [fetchDataPoints.pending]: (state, action) => {
      state.dataPoints.isLoading = true
      // state.dataPoints.value = []
      state.dataPoints.message = null
    },
    [fetchDataPoints.fulfilled]: (state, action: PayloadAction<DataPoints>) => {
      state.dataPoints.isLoading = false
      state.dataPoints.value = action.payload
      state.dataPoints.message = null
    },
    [fetchDataPoints.rejected]: (state, action) => {
      state.dataPoints.isLoading = false
      state.dataPoints.value = []
      state.dataPoints.message = {text: `Could not get current rate.`, type: 'warning'}
    },
    // SUBMIT
    [submitValues.pending]: (state, action) => {
      state.isSubmitting = true
    },
    [submitValues.fulfilled]: (state, action) => {
      state.isSubmitting = false
      state.canSubmit = false
      state.message = {text: `Successfully submitted.`, type: 'success'}
      state.inputValueFrom = ''
      state.inputValueTo = ''
    },
    [submitValues.rejected]: (state, action) => {
      state.isSubmitting = false
      state.canSubmit = false
      state.message = {text: `Something went wrong. Try again later.`, type: 'warning'}
    },
  },
})

export const {
  handleInputChangeTo,
  handleInputChangeFrom,
  handleStateUpdate,
  handleSelectFrom,
  handleSelectTo,
  handleSwapCurrencies,
} = appReducer.actions
export default appReducer.reducer

export const updateSelectedTo = (): AppThunk => dispatch => {
  dispatch(handleStateUpdate())
}

export const onInputChangeFrom = (value: string): AppThunk => dispatch => {
  dispatch(handleInputChangeFrom(value))
}

export const onInputChangeTo = (value: string): AppThunk => dispatch => {
  dispatch(handleInputChangeTo(value))
}

export const selectFrom = (selectedFrom: Currency): AppThunk => dispatch => {
  dispatch(handleSelectFrom(selectedFrom))
}

export const selectTo = (selected: Currency): AppThunk => dispatch => {
  dispatch(handleSelectTo(selected))
}

export const swapCurrencies = (): AppThunk => dispatch => {
  dispatch(handleSwapCurrencies())
}

export {fetchDataPoints, fetchCurrentRate, fetchCurrencies, submitValues}
export const stateSelector = (state: RootState) => state.app
