import { CurrencyState, Currency } from 'store/types'
import { getDataPoints, getCurrencies, getCurrentRate } from 'utils/api/currenciesAPI'
import { savePockets } from 'utils/api/backendAPI'
import { create } from 'zustand'
import { isValidInput, getSelected, getPocketValueFrom, getInputValueTo, getPocketValueTo, getCanSubmit, getInputValueFrom } from 'utils/helpers'

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

const [useStore, api] = create((set, get) => ({
  ...initialState,

  // Async Actions
  asyncActions: {
    fetchCurrencies: async () => {
      const [defaultFrom, defaultTo] = ['EUR', 'GBP']
      try {
        const currencies = await getCurrencies()
        const currentRate = await getCurrentRate({ selectedFrom: defaultFrom, selectedTo: defaultTo })
        const dataPoints = await getDataPoints({ selectedFrom: defaultFrom, selectedTo: defaultTo })
        const selectedFrom = getSelected(defaultFrom, currencies)
        const selectedTo = getSelected(defaultTo, currencies)
        if (!selectedTo || !selectedFrom) throw Error()
        set({
          ...initialState,
          currencies: { isLoading: false, value: currencies, message: null },
          currentRate: { isLoading: false, value: currentRate, message: null },
          dataPoints: { isLoading: false, value: dataPoints, message: null },
          pocketValueFrom: getPocketValueFrom(selectedFrom?.value, '0'),
          pocketValueTo: getPocketValueTo(selectedTo?.value, '0'),
          selectedFrom,
          selectedTo,
        })
      } catch (e) {
        set({
          currencies: {
            isLoading: false,
            value: [],
            message: { text: `Could not get currency list. Try again later.`, type: 'warning' },
          },
        })
      }
    },
    fetchCurrentRate: async ({ selectedFrom, selectedTo }: any) => {
      try {
        const currentRate = await getCurrentRate({ selectedFrom, selectedTo })
        set({ currentRate: { isLoading: false, value: currentRate, message: null } })
      } catch (e) {
        set({
          currentRate: { isLoading: false, value: 0, message: { text: `Could not get current rate.`, type: 'warning' } },
        })
      }
    },
    fetchDataPoints: async ({ selectedFrom, selectedTo }: { selectedFrom: string; selectedTo: string }) => {
      try {
        const dataPoints = await getDataPoints({ selectedFrom, selectedTo })
        set({ dataPoints: { isLoading: false, value: dataPoints, message: null } })
      } catch (e) {
        set({
          dataPoints: {
            isLoading: false,
            value: [],
            message: { text: `Could not get data points rate.`, type: 'warning' },
          },
        })
      }
    },
    handleSubmitValues: async () => {
      set({
        submitValues: { isSubmitting: true, message: null },
      })
      const { selectedFrom, selectedTo, inputValueFrom, inputValueTo, asyncActions } = get()
      const { fetchCurrencies } = asyncActions
      const from = { name: selectedFrom.name, value: inputValueFrom }
      const to = { name: selectedTo.name, value: inputValueTo }
      try {
        await savePockets({ from, to })
        await fetchCurrencies()
        set({
          submitValues: { isSubmitting: false, message: { text: `Successfully submitted.`, type: 'success' } },
        })
      } catch (e) {
        set({
          submitValues: {
            isSubmitting: false,
            message: { text: `Something went wrong. Try again later.`, type: 'warning' },
          },
        })
      }
    },
  },

  // Actions
  actions: {
    handleInputChangeFrom: (inputValueFrom: string) => {
      if (!isValidInput(inputValueFrom)) return
      const { selectedFrom, selectedTo, currentRate } = get()
      const pocketValueFrom = getPocketValueFrom(selectedFrom.value, inputValueFrom)
      const inputValueTo = getInputValueTo(inputValueFrom, currentRate.value)
      const pocketValueTo = getPocketValueTo(selectedTo.value, inputValueTo)
      const canSubmit = getCanSubmit({ pocketValueFrom, inputValueFrom })
      set({ inputValueFrom, inputValueTo, pocketValueFrom, pocketValueTo, canSubmit })
    },
    handleInputChangeTo: (inputValueTo: string) => {
      if (!isValidInput(inputValueTo)) return
      const { selectedFrom, selectedTo, currentRate } = get()
      const inputValueFrom = getInputValueFrom(inputValueTo, currentRate.value)
      const pocketValueFrom = getPocketValueFrom(selectedFrom.value, inputValueFrom)
      const pocketValueTo = getPocketValueTo(selectedTo.value, inputValueTo)
      const canSubmit = getCanSubmit({ pocketValueFrom, inputValueFrom })
      set({ inputValueFrom, inputValueTo, pocketValueFrom, pocketValueTo, canSubmit })
    },
    handleSelectFrom(selectedFrom: Currency) {
      const { inputValueFrom } = get()
      const pocketValueFrom = getPocketValueFrom(selectedFrom.value, inputValueFrom)
      const canSubmit = getCanSubmit({ pocketValueFrom, inputValueFrom })
      set({ pocketValueFrom, selectedFrom, canSubmit })
    },
    handleSelectTo(selectedTo: Currency) {
      const { inputValueTo } = get()
      set({ selectedTo, pocketValueTo: getPocketValueTo(selectedTo.value, inputValueTo) })
    },
    handleSelectedToUpdate() {
      const { inputValueFrom, currentRate, selectedTo } = get()
      const inputValueTo = getInputValueTo(inputValueFrom, currentRate.value)
      const pocketValueTo = getPocketValueTo(selectedTo.value, inputValueTo)
      set({ inputValueTo, pocketValueTo })
    },
    handleSwapCurrencies() {
      const { selectedFrom, selectedTo, inputValueTo } = get()
      const newSelectedTo = selectedFrom
      const newSelectedFrom = selectedTo
      const inputValueFrom = inputValueTo
      const pocketValueFrom = getPocketValueFrom(newSelectedFrom.value, inputValueFrom)
      const canSubmit = getCanSubmit({ pocketValueFrom, inputValueFrom })
      set({
        selectedTo: newSelectedTo,
        selectedFrom: newSelectedFrom,
        inputValueFrom,
        pocketValueFrom,
        canSubmit,
      })
    },
  },
}))

export default useStore
export { api }
