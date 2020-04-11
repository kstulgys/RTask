import {Currencies, CurrencyState, Currency, DataPoints} from 'app/types'
import {create} from 'zustand'
import {getDataPoints, getCurrencies, getCurrentRate, updatePockets} from 'api/currenciesAPI'
import {
  isValidInput,
  getSelected,
  getPocketValueFrom,
  getInputValueTo,
  getPocketValueTo,
  getCanSubmit,
  getInputValueFrom,
} from 'utils/helpers'

export const initialState: CurrencyState = {
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
    value: [],
    message: null,
  },
  currentRate: {
    value: 0,
    message: null,
  },
  submitValues: {
    isSubmitting: false,
    message: null,
  },
}

const [useStore] = create((set, get) => ({
  ...initialState,

  // Async Actions
  asyncActions: {
    fetchCurrencies: async () => {
      const defaultFrom = 'GBP'
      const defaultTo = 'USD'
      try {
        const currencies = await getCurrencies()
        const currentRate = await getCurrentRate({selectedFrom: defaultFrom, selectedTo: defaultTo})
        const dataPoints = await getDataPoints({selectedFrom: defaultFrom, selectedTo: defaultTo})
        const selectedFrom = getSelected(defaultFrom, currencies)
        const selectedTo = getSelected(defaultTo, currencies)
        set({
          ...initialState,
          currencies: {isLoading: false, value: currencies, message: null},
          currentRate: {isLoading: false, value: currentRate, message: null},
          dataPoints: {isLoading: false, value: dataPoints, message: null},
          pocketValueFrom: selectedFrom?.value.toString(),
          pocketValueTo: selectedTo?.value.toString(),
          selectedFrom,
          selectedTo,
        })
      } catch (e) {
        set({
          currencies: {
            isLoading: false,
            value: [],
            message: {text: `Could not get currency list. Try again later.`, type: 'warning'},
          },
        })
      }
    },

    fetchCurrentRate: async ({selectedFrom, selectedTo}: any) => {
      try {
        const currentRate = await getCurrentRate({selectedFrom, selectedTo})
        set({currentRate: {isLoading: false, value: currentRate, message: null}})
      } catch (e) {
        set({
          currentRate: {isLoading: false, value: 0, message: {text: `Could not get current rate.`, type: 'warning'}},
        })
      }
    },

    fetchDataPoints: async ({selectedFrom, selectedTo}: any) => {
      try {
        const dataPoints = await getDataPoints({selectedFrom, selectedTo})
        set({dataPoints: {isLoading: false, value: dataPoints, message: null}})
      } catch (e) {
        set({
          dataPoints: {
            isLoading: false,
            value: [],
            message: {text: `Could not get data points rate.`, type: 'warning'},
          },
        })
      }
    },

    handleSubmitValues: async () => {
      const {selectedFrom, selectedTo, inputValueFrom, inputValueTo} = get()
      const from = {name: selectedFrom.name, value: +inputValueFrom}
      const to = {name: selectedTo.name, value: +inputValueTo}
      try {
        await updatePockets({selectedFrom: from, selectedTo: to})
        set({
          ...initialState,
          submitValues: {isSubmitting: false, message: {text: `Successfully submitted.`, type: 'success'}},
        })
      } catch (e) {
        set({
          submitValues: {
            isSubmitting: false,
            message: {text: `Something went wrong. Try again later.`, type: 'warning'},
          },
        })
      }
    },
  },

  // Actions
  actions: {
    handleInputChangeFrom: (inputValueFrom: any) => {
      if (!isValidInput(inputValueFrom)) return
      const {selectedFrom, selectedTo, currentRate} = get()
      const pocketValueFrom = getPocketValueFrom(selectedFrom.value, inputValueFrom)
      const inputValueTo = getInputValueTo(inputValueFrom, currentRate.value)
      const pocketValueTo = getPocketValueTo(selectedTo.value, inputValueTo)
      const canSubmit = getCanSubmit({pocketValueFrom, inputValueFrom})
      set({inputValueFrom, inputValueTo, pocketValueFrom, pocketValueTo, canSubmit})
    },
    handleInputChangeTo: (inputValueTo: any) => {
      if (!isValidInput(inputValueTo)) return
      const {selectedFrom, selectedTo, currentRate} = get()
      const inputValueFrom = getInputValueFrom(inputValueTo, currentRate.value)
      const pocketValueFrom = getPocketValueFrom(selectedFrom.value, inputValueFrom)
      const pocketValueTo = getPocketValueTo(selectedTo.value, inputValueTo)
      const canSubmit = getCanSubmit({pocketValueFrom, inputValueFrom})
      set({inputValueFrom, inputValueTo, pocketValueFrom, pocketValueTo, canSubmit})
    },
    handleSelectFrom(selectedFrom: any) {
      const {inputValueFrom} = get()
      const pocketValueFrom = getPocketValueFrom(selectedFrom.value, inputValueFrom)
      const canSubmit = getCanSubmit({pocketValueFrom, inputValueFrom})
      set({pocketValueFrom, selectedFrom, canSubmit})
    },
    handleSelectTo(selectedTo: any) {
      const {inputValueTo} = get()
      set({selectedTo, pocketValueTo: getPocketValueTo(selectedTo.value, inputValueTo)})
    },
    handleSelectedToUpdate() {
      const {inputValueFrom, currentRate, selectedTo} = get()
      const inputValueTo = getInputValueTo(inputValueFrom, currentRate.value)
      const pocketValueTo = getPocketValueTo(selectedTo.value, inputValueTo)
      set({inputValueTo, pocketValueTo})
    },
    handleSwapCurrencies() {
      const {selectedFrom, selectedTo, inputValueTo} = get()
      const newSelectedTo = selectedFrom
      const newSelectedFrom = selectedTo
      const inputValueFrom = inputValueTo
      const pocketValueFrom = getPocketValueFrom(newSelectedFrom.value, inputValueFrom)
      const canSubmit = getCanSubmit({pocketValueFrom, inputValueFrom})
      set({selectedTo: newSelectedTo, selectedFrom: newSelectedFrom, inputValueFrom, pocketValueFrom, canSubmit})
    },
  },
}))

export default useStore

// interface GetCurrenciesSuccessPayload {
//   currencies: Currencies
//   currentRate: number
//   dataPoints: DataPoints
//   selectedFrom: Currency | undefined
//   selectedTo: Currency | undefined
// }

// const appReducer = createSlice({
//   name: 'app',
//   initialState,
//   reducers: {
//     //     // handle update
//     //     handleStateUpdate(state) {
//     //       if (!state.selectedTo || !state.currentRate) return
//     //       state.inputValueTo = getInputValueTo(state.inputValueFrom, state.currentRate.value)
//     //       state.pocketValueTo = getPocketValueTo(state.selectedTo.value, state.inputValueTo)
//     //     },
//     // handle change
//     // handleInputChangeFrom(state, action: PayloadAction<string>) {
//     //   if (!state.selectedFrom || !state.selectedTo || !state.currentRate || !isValidInput(action.payload)) return
//     //   state.inputValueTo = getInputValueTo(action.payload, state.currentRate.value)
//     //   state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, action.payload)
//     //   state.pocketValueTo = getPocketValueTo(state.selectedTo.value, state.inputValueTo)
//     //   state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: action.payload})
//     //   state.inputValueFrom = action.payload
//     // },
//     // handleInputChangeTo(state, action: PayloadAction<string>) {
//     //   if (!state.selectedTo || !state.selectedFrom || !state.currentRate || !isValidInput(action.payload)) return
//     //   state.inputValueTo = action.payload
//     //   state.inputValueFrom = getInputValueFrom(state.inputValueTo, state.currentRate.value)
//     //   state.pocketValueTo = getPocketValueTo(state.selectedTo.value, action.payload)
//     //   state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, state.inputValueFrom)
//     //   state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: state.inputValueFrom})
//     // },
//     // handleSelectFrom(state, action: PayloadAction<Currency>) {
//     //   if (!state.selectedTo) return
//     //   state.selectedFrom = action.payload
//     //   state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, state.inputValueFrom)
//     //   state.canSubmit = getCanSubmit({
//     //     pocketValueFrom: state.pocketValueFrom,
//     //     inputValueFrom: state.inputValueFrom,
//     //   })
//     // },
//     // handleSelectTo(state, action: PayloadAction<Currency>) {
//     //   state.selectedTo = action.payload
//     //   state.pocketValueTo = getPocketValueTo(state.selectedTo.value, state.inputValueTo)
//     // },
//     // handleSwapCurrencies(state) {
//     //   if (!state.selectedTo) return
//     //   const selectedTo = state.selectedFrom
//     //   const selectedFrom = state.selectedTo
//     //   state.selectedTo = selectedTo
//     //   state.selectedFrom = selectedFrom
//     //   state.inputValueFrom = state.inputValueTo
//     //   state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, state.inputValueFrom)
//     //   state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: state.inputValueFrom})
//     // },
//     // },
//     // extraReducers: {
//     // CURRENCIES
//     // [fetchCurrencies.pending]: (state, action) => {
//     //   // state.currencies.isLoading = true
//     //   state.currencies.value = []
//     //   state.currencies.message = null
//     // },
//     // [fetchCurrencies.fulfilled]: (state, action: PayloadAction<GetCurrenciesSuccessPayload>) => {
//     //   const {currencies, currentRate, dataPoints, selectedFrom, selectedTo} = action.payload
//     //   if (!selectedFrom || !selectedTo) return
//     //   state.currentRate.value = currentRate
//     //   state.dataPoints.value = dataPoints
//     //   state.selectedFrom = selectedFrom
//     //   state.selectedTo = selectedTo
//     //   state.pocketValueFrom = selectedFrom.value.toString()
//     //   state.pocketValueTo = selectedTo.value.toString()
//     //   state.currencies.value = currencies
//     //   state.currencies.isLoading = false
//     //   state.currencies.message = null
//     //   state.inputValueFrom = ''
//     //   state.inputValueTo = ''
//     // },
//     // [fetchCurrencies.rejected]: (state, action) => {
//     //   state.currencies.isLoading = false
//     //   state.currencies.value = []
//     //   state.currencies.message = {text: `Could not get currency list. Try again later.`, type: 'warning'}
//     // },
//     // CURRENT RATE
//     // [fetchCurrentRate.fulfilled]: (state, action: PayloadAction<number>) => {
//     //   state.currentRate.value = action.payload
//     //   state.currentRate.message = null
//     // },
//     // [fetchCurrentRate.rejected]: (state, action) => {
//     //   state.currentRate.value = 0
//     //   state.currentRate.message = {text: `Could not get current rate.`, type: 'warning'}
//     // },
//     // DATA POINTS
//     // [fetchDataPoints.fulfilled]: (state, action: PayloadAction<DataPoints>) => {
//     //   state.dataPoints.value = action.payload
//     //   state.dataPoints.message = null
//     // },
//     // [fetchDataPoints.rejected]: (state, action) => {
//     //   state.dataPoints.value = []
//     //   state.dataPoints.message = {text: `Could not get current rate.`, type: 'warning'}
//     // },
//     // SUBMIT
//     // [submitValues.pending]: (state, action) => {
//     //   state.isSubmitting = true
//     // },
//     // [submitValues.fulfilled]: (state, action) => {
//     //   state.isSubmitting = false
//     //   state.canSubmit = false
//     //   state.message = {text: `Successfully submitted.`, type: 'success'}
//     //   state.inputValueFrom = ''
//     //   state.inputValueTo = ''
//     // },
//     // [submitValues.rejected]: (state, action) => {
//     //   state.isSubmitting = false
//     //   state.canSubmit = false
//     //   state.message = {text: `Something went wrong. Try again later.`, type: 'warning'}
//     // },
//   },
// })

// export const {
//   handleInputChangeTo,
//   handleInputChangeFrom,
//   handleStateUpdate,
//   handleSelectFrom,
//   handleSelectTo,
//   handleSwapCurrencies,
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

// export const swapCurrencies = (): AppThunk => dispatch => {
//   dispatch(handleSwapCurrencies())
// }

// export {fetchDataPoints, fetchCurrentRate, fetchCurrencies, submitValues}
// export const stateSelector = (state: RootState) => state.app
