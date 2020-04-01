// import {createSlice, PayloadAction} from '@reduxjs/toolkit'
// import {fetchDataPoints, fetchCurrentRate, fetchCurrencies, submitValues, swapCurrencies} from 'app/asyncActions'
// import {Currencies, CurrencyState, Currency, DataPoints} from 'app/types'
// import {AppThunk, RootState} from 'app/store'
// import {
//   getCanSubmit,
//   isValidInput,
//   getInputValueTo,
//   getInputValueFrom,
//   getPocketValueTo,
//   getPocketValueFrom,
// } from 'utils/helpers'

// export const initialState: CurrencyState = {
//   // isLoading: true,
//   // currencies: [],
//   // dataPoints: [],
//   // currentRate: undefined,
//   isSubmitting: false,
//   selectedFrom: undefined,
//   selectedTo: undefined,
//   error: null,
//   timesSubmitted: 0,
// }

// interface GetCurrenciesSuccessPayload {
//   currencies: Currencies
//   currentRate: number
//   dataPoints: {x: number; y: number}[]
//   selectedFrom: Currency | undefined
//   selectedTo: Currency | undefined
// }

// const appReducer = createSlice({
//   name: 'app',
//   initialState,
//   reducers: {
//     // handle update
//     handleStateUpdate(state) {
//       if (!state.selectedTo || !state.currentRate) return
//       state.inputValueTo = getInputValueTo(state.inputValueFrom, state.currentRate)
//       state.pocketValueTo = getPocketValueTo(state.selectedTo.value, state.inputValueTo)
//     },
//     // handle change
//     handleInputChangeFrom(state, action: PayloadAction<string>) {
//       if (!state.selectedFrom || !state.selectedTo || !state.currentRate || !isValidInput(action.payload)) return
//       state.inputValueTo = getInputValueTo(action.payload, state.currentRate)
//       state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, action.payload)
//       state.pocketValueTo = getPocketValueTo(state.selectedTo.value, state.inputValueTo)
//       state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: action.payload})
//       state.inputValueFrom = action.payload
//     },
//     handleInputChangeTo(state, action: PayloadAction<string>) {
//       if (!state.selectedTo || !state.selectedFrom || !state.currentRate || !isValidInput(action.payload)) return
//       state.inputValueTo = action.payload
//       state.inputValueFrom = getInputValueFrom(state.inputValueTo, state.currentRate)
//       state.pocketValueTo = getPocketValueTo(state.selectedTo.value, action.payload)
//       state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, state.inputValueFrom)
//       state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: state.inputValueFrom})
//     },
//     handleSelectFrom(state, action: PayloadAction<Currency>) {
//       if (!state.selectedTo) return
//       state.selectedFrom = action.payload
//       state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, state.inputValueFrom)
//       state.canSubmit = getCanSubmit({
//         pocketValueFrom: state.pocketValueFrom,
//         inputValueFrom: state.inputValueFrom,
//       })
//     },
//     handleSelectTo(state, action: PayloadAction<Currency>) {
//       state.selectedTo = action.payload
//       state.pocketValueTo = getPocketValueTo(state.selectedTo.value, state.inputValueTo)
//     },
//   },
//   extraReducers: {
//     // [fetchCurrencies.fulfilled]: (state, action: PayloadAction<GetCurrenciesSuccessPayload>) => {
//     //   const {currencies, currentRate, dataPoints, selectedFrom, selectedTo} = action.payload
//     //   if (!selectedFrom || !selectedTo) return
//     //   state = {
//     //     ...initialState,
//     //     currencies,
//     //     currentRate,
//     //     dataPoints,
//     //     selectedFrom,
//     //     selectedTo,
//     //     isLoading: false,
//     //     pocketValueFrom: selectedFrom.value.toString(),
//     //     pocketValueTo: selectedTo.value.toString(),
//     //   }
//     //   return state
//     // },
//     // [fetchCurrencies.rejected]: (state, action) => {
//     //   state.isLoading = false
//     //   state.error = {message: `Something went wrong.`, type: 'warning'}
//     // },
//     // [fetchCurrentRate.fulfilled]: (state, action: PayloadAction<{currentRate: number; dataPoints: DataPoints}>) => {
//     //   const {dataPoints, currentRate} = action.payload
//     //   state.currentRate = currentRate
//     //   state.dataPoints = dataPoints
//     //   state.error = null
//     // },
//     // [fetchCurrentRate.rejected]: (state, action) => {
//     //   if (!state.selectedTo) return
//     //   state.currentRate = undefined
//     //   state.error = {message: `Could not get ${state.selectedTo.name} current rate.`, type: 'warning'}
//     // },
//     // [fetchDataPoints.fulfilled]: (state, action: PayloadAction<{x: number; y: number}[]>) => {
//     //   state.dataPoints = action.payload
//     // },
//     // [fetchDataPoints.rejected]: (state, action) => {
//     //   if (!state.selectedTo) return
//     //   state.dataPoints = []
//     //   state.error = {message: `Could not get ${state.selectedTo.name} history data.`, type: 'warning'}
//     // },
//     [submitValues.pending]: (state, action) => {
//       if (!state.canSubmit) return
//       state.isSubmitting = true
//     },
//     [submitValues.fulfilled]: (state, action) => {
//       state.error = {message: `Success.`, type: 'success'}
//       state.timesSubmitted = state.timesSubmitted + 1
//       state.isSubmitting = false
//       state.canSubmit = false
//     },
//     [submitValues.rejected]: (state, action) => {
//       state.error = {message: `Something went wrong. Try again later.`, type: 'warning'}
//     },
//     [swapCurrencies.fulfilled]: (state, action: PayloadAction<number>) => {
//       if (!state.selectedFrom || !state.selectedTo) return
//       const selectedTo = state.selectedFrom
//       const selectedFrom = state.selectedTo
//       state.selectedTo = selectedTo
//       state.selectedFrom = selectedFrom
//       state.inputValueFrom = state.inputValueTo
//       state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, state.inputValueFrom)
//       state.currentRate = action.payload
//       state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: state.inputValueFrom})
//     },
//   },
// })

// export const {
//   handleInputChangeTo,
//   handleInputChangeFrom,
//   handleStateUpdate,
//   handleSelectFrom,
//   handleSelectTo,
// } = appReducer.actions
// export default appReducer.reducer

// export const updateSelectedTo = (): AppThunk => dispatch => {
//   dispatch(handleStateUpdate())
// }

// export const onInputChangeFrom = (value: string): AppThunk => dispatch => {
//   dispatch(handleInputChangeFrom(value))
// }

// export const onInputChangeTo = (value: string): AppThunk => dispatch => {
//   dispatch(handleInputChangeTo(value))
// }

// export const selectFrom = (selectedFrom: Currency): AppThunk => dispatch => {
//   dispatch(handleSelectFrom(selectedFrom))
// }

// export const selectTo = (selected: Currency): AppThunk => dispatch => {
//   dispatch(handleSelectTo(selected))
// }

// export {fetchDataPoints, fetchCurrentRate, fetchCurrencies, submitValues, swapCurrencies}
// export const stateSelector = (state: RootState) => state.app
export {}
