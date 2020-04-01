import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {fetchDataPoints, fetchCurrentRate, fetchCurrencies, submitValues, swapCurrencies} from 'app/asyncActions'
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

interface InitialState {
  pocketValueFrom: string
  pocketValueTo: string
  inputValueFrom: string
  inputValueTo: string
  canSubmit: boolean
}

export const initialState: InitialState = {
  pocketValueFrom: '',
  pocketValueTo: '',
  inputValueFrom: '',
  inputValueTo: '',
  canSubmit: false,
}

interface InputChangeProps {
  inputValue: string
  selectedFromValue: string
  currentRate: number
  selectedToValue: string
}

const inputChangeReducer = createSlice({
  name: 'inputChange',
  initialState,
  reducers: {
    handleInputChangeFrom(state, action: PayloadAction<InputChangeProps>) {
      const {inputValue, selectedFromValue, currentRate, selectedToValue} = action.payload
      if (!isValidInput(inputValue)) return
      state.inputValueFrom = inputValue
      state.pocketValueFrom = getPocketValueFrom(selectedFromValue, state.inputValueFrom)
      state.inputValueTo = getInputValueTo(state.inputValueFrom, currentRate)
      state.pocketValueTo = getPocketValueTo(selectedToValue, state.inputValueTo)
      state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: state.inputValueFrom})
    },
    handleInputChangeTo(state, action: PayloadAction<InputChangeProps>) {
      const {inputValue, selectedFromValue, currentRate, selectedToValue} = action.payload
      if (!isValidInput(inputValue)) return
      state.inputValueTo = inputValue
      state.pocketValueFrom = getPocketValueFrom(selectedFromValue, state.inputValueFrom)
      state.inputValueFrom = getInputValueFrom(state.inputValueTo, currentRate)
      state.pocketValueTo = getPocketValueTo(selectedToValue, state.inputValueTo)
      state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: state.inputValueFrom})
    },
    handleInitialPocketValueFrom(state, action) {
      state.pocketValueFrom = action.payload
    },
    handleInitialPocketValueTo(state, action) {
      state.pocketValueTo = action.payload
    },
    handleInputsSwap(state, action) {
      //   const selectedTo = state.selectedFrom
      //   const selectedFrom = state.selectedTo
      //   state.selectedTo = selectedTo
      //   state.selectedFrom = selectedFrom
      //   state.currentRate = action.payload
      //   const selectedValueFrom = +state.pocketValueTo - +state.inputValueTo
      //   state.inputValueFrom = state.inputValueTo
      //   state.pocketValueFrom = getPocketValueFrom(selectedValueFrom, state.inputValueFrom)
      //   state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: state.inputValueFrom})
    },
  },
  extraReducers: {},
})

export const {
  handleInputsSwap,
  handleInputChangeTo,
  handleInputChangeFrom,
  handleInitialPocketValueFrom,
  handleInitialPocketValueTo,
} = inputChangeReducer.actions
export default inputChangeReducer.reducer

export const setInitialPocketValueFrom = (payload: string): AppThunk => dispatch => {
  dispatch(handleInitialPocketValueFrom(payload))
}

export const setInitialPocketValueTo = (payload: string): AppThunk => dispatch => {
  dispatch(handleInitialPocketValueTo(payload))
}

export const onInputChangeFrom = (payload: InputChangeProps): AppThunk => dispatch => {
  dispatch(handleInputChangeFrom(payload))
}

export const onInputChangeTo = (payload: InputChangeProps): AppThunk => dispatch => {
  dispatch(handleInputChangeTo(payload))
}

// export {fetchDataPoints, fetchCurrentRate, fetchCurrencies, submitValues, swapCurrencies}
export const inputChangeSelector = (state: RootState) => state.inputChange
