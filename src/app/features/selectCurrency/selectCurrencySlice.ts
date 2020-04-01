import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Currency} from 'app/types'
import {AppThunk, RootState} from 'app/store'

interface InitialState {
  selectedFrom: Currency | undefined
  selectedTo: Currency | undefined
}

export const initialState: InitialState = {
  selectedFrom: undefined,
  selectedTo: undefined,
}

const selectCurrencyReducer = createSlice({
  name: 'selectCurrency',
  initialState,
  reducers: {
    handleSelectFrom(state, action: PayloadAction<Currency>) {
      state.selectedFrom = action.payload
    },
    handleSelectTo(state, action: PayloadAction<Currency>) {
      state.selectedTo = action.payload
    },
    handleSelectedSwap(state, action) {
      const selectedTo = state.selectedFrom
      const selectedFrom = state.selectedTo
      state.selectedTo = selectedTo
      state.selectedFrom = selectedFrom
    },
  },
})

export const {handleSelectFrom, handleSelectTo, handleSelectedSwap} = selectCurrencyReducer.actions
export default selectCurrencyReducer.reducer

export const swapSelected = (selectedFrom: Currency): AppThunk => dispatch => {
  dispatch(handleSelectedSwap(selectedFrom))
}

export const selectFrom = (selectedFrom: Currency): AppThunk => dispatch => {
  dispatch(handleSelectFrom(selectedFrom))
}

export const selectTo = (selectedTo: Currency): AppThunk => dispatch => {
  dispatch(handleSelectTo(selectedTo))
}

// export {fetchDataPoints, fetchCurrentRate, fetchCurrencies, submitValues, swapCurrencies}
// export const stateSelector = (state: RootState) => state.app
