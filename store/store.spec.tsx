import * as React from 'react'
import { render, act } from 'utils/testing'
import user from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import useStore, { api, initialState } from 'store'
import * as currenciesAPI from 'utils/api/currenciesAPI'
import IndexPage from 'pages'

jest.mock('utils/api/currenciesAPI')
jest.mock('utils/api/backendAPI')

const setup = () => render(<IndexPage />)
const currencies = [
  { name: 'GBP', value: 10000 },
  { name: 'USD', value: 20000 },
]
const currentRate = 1
const dataPoints = [
  { x: 1, y: 1 },
  { x: 1, y: 1 },
]
test('fetch currencies ', async () => {
  currenciesAPI.getCurrencies.mockReturnValue(currencies)
  currenciesAPI.getCurrentRate.mockReturnValue(1)
  currenciesAPI.getDataPoints.mockReturnValue(dataPoints)

  setup()
  await expect(currenciesAPI.getCurrencies).toBeCalledTimes(1)
  await expect(currenciesAPI.getCurrentRate).toBeCalledTimes(1)
  await expect(currenciesAPI.getDataPoints).toBeCalledTimes(1)

  const state = api.getState()

  const currentState = {
    ...initialState,
    currencies: state.currencies,
    currentRate: state.currentRate,
    dataPoints: state.dataPoints,
    pocketValueFrom: state.pocketValueFrom,
    pocketValueTo: state.pocketValueTo,
    selectedFrom: state.selectedFrom,
    selectedTo: state.selectedTo,
  }

  const expectedState = {
    ...initialState,
    currencies: { isLoading: false, value: currencies, message: null },
    currentRate: { isLoading: false, value: currentRate, message: null },
    dataPoints: { isLoading: false, value: dataPoints, message: null },
    pocketValueFrom: '10,000.00',
    pocketValueTo: '20,000.00',
    selectedFrom: currencies[0],
    selectedTo: currencies[1],
  }

  expect(currentState).toEqual(expectedState)
})

// describe('Layout', () => {
//   it('has loader visible', async () => {
//     const {getByTestId, debug, store} = render(<App />, {...initialState})
//     expect(getByTestId('loader')).toBeInTheDocument()
//   })

//   it('has no loader when data is loaded', async () => {
//     const {queryByTestId, debug} = render(<App />)
//     expect(queryByTestId(/loader/i)).toBeNull()
//   })

//   it('has title"', () => {
//     const {getByText} = render(<App />)
//     expect(getByText(/exchange money/i)).toBeInTheDocument()
//   })

//   it('has labels "From" and "to"', () => {
//     const {getByText, getByTestId} = render(<App />)
//     expect(getByText('From')).toBeInTheDocument()
//     expect(getByText('To')).toBeInTheDocument()
//   })

//   it('has dropdown components"', () => {
//     const {getByTestId} = render(<App />)
//     expect(getByTestId('dropdown-from')).toBeInTheDocument()
//     expect(getByTestId('dropdown-to')).toBeInTheDocument()
//   })

//   it('has pocket values"', () => {
//     const {getByTestId} = render(<App />)
//     expect(getByTestId('pocket-from')).toBeInTheDocument()
//     expect(getByTestId('pocket-to')).toBeInTheDocument()
//   })
//   it('has input fields"', () => {
//     const {getByTestId} = render(<App />)
//     expect(getByTestId('input-from')).toBeInTheDocument()
//     expect(getByTestId('input-to')).toBeInTheDocument()
//   })
//   it('has submit/continue button"', () => {
//     const {getAllByText} = render(<App />)
//     const buttons = getAllByText(/continue/i)
//     // one is hidden for mobile and vice versa
//     expect(buttons).toHaveLength(2)
//   })
//   it('has current rate"', () => {
//     const {getByTestId} = render(<App />)
//     expect(getByTestId('current-rate')).toBeInTheDocument()
//   })

//   it('has current change"', async () => {
//     const {getByTestId} = render(<App />)
//     expect(getByTestId('current-change')).toBeInTheDocument()
//   })

//   it('has "swapp" button"', () => {
//     const {getByTestId} = render(<App />)
//     expect(getByTestId('button-swap')).toBeInTheDocument()
//   })
// })

// describe('Input change', () => {
//   const state = {
//     selectedFrom: {name: 'GBP', value: 51234},
//     selectedTo: {name: 'USD', value: 71234},
//     pocketValueFrom: fPocket(51234),
//     pocketValueTo: fPocket(71234),
//     inputValueFrom: '',
//     inputValueTo: '',
//   }

//   let inputFrom: HTMLInputElement, inputTo: HTMLInputElement, pocketFrom: HTMLElement, pocketTo: HTMLElement
//   let newValue: string
//   const setup = () => {
//     const {getByTestId, store} = render(<App />, {...state})
//     inputFrom = getByTestId('input-from') as HTMLInputElement
//     inputTo = getByTestId('input-to') as HTMLInputElement
//     pocketFrom = getByTestId('pocket-from')
//     pocketTo = getByTestId('pocket-to')
//     newValue = '5000.43'
//     expect(inputFrom.value).toBe('')
//     expect(inputTo.value).toBe('')
//     expect(pocketFrom).toHaveTextContent(state.pocketValueFrom)
//     expect(pocketTo).toHaveTextContent(state.pocketValueTo)
//     return store
//   }

//   test('on input FROM change - updates input value FROM, input value TO, pocket value FROM, pocket value TO', () => {
//     const store = setup()
//     user.type(inputFrom, newValue)
//     // updates input FROM value
//     expect(inputFrom.value).toBe(store.getState().app.inputValueFrom)
//     // updates input TO value
//     expect(inputTo.value).toBe(store.getState().app.inputValueTo)
//     // updates pocket FROM value
//     expect(pocketFrom).toHaveTextContent(store.getState().app.pocketValueFrom)
//     // updates pocket TO value
//     expect(pocketTo).toHaveTextContent(store.getState().app.pocketValueTo)
//   })

//   it('on input TO change - updates input value FROM, input value TO, pocket value FROM, pocket value TO', () => {
//     const store = setup()
//     user.type(inputTo, newValue)
//     // updates input FROM value
//     expect(inputFrom.value).toBe(store.getState().app.inputValueFrom)
//     // updates input TO value
//     expect(inputTo.value).toBe(store.getState().app.inputValueTo)
//     // updates pocket FROM value
//     expect(pocketFrom).toHaveTextContent(store.getState().app.pocketValueFrom)
//     // updates pocket TO value
//     expect(pocketTo).toHaveTextContent(store.getState().app.pocketValueTo)
//   })
// })

// const currencies = [
//   {name: 'GBP', value: 10000.99},
//   {name: 'USD', value: 20000.33},
//   {name: 'AUD', value: 30000.99},
//   {name: 'LTU', value: 40000.33},
// ]
// describe('select currency', () => {
//   const props = {
//     pocketValueFrom: currencies[0].value.toString(),
//     pocketValueTo: currencies[1].value.toString(),
//     selectedFrom: currencies[0],
//     selectedTo: currencies[1],
//     currencies: {isLoading: false, value: currencies, message: null},
//   }
//   test('select currency FROM', () => {
//     const {getByTestId, queryByTestId, debug, store} = render(<App />, {
//       ...props,
//     })
//     const dropdownList = queryByTestId('dropdown-list-from')
//     expect(dropdownList).toBeNull()
//     const dropdownDiv = getByTestId('dropdown-from')
//     user.click(dropdownDiv)
//     expect(getByTestId('dropdown-list-from')).toBeInTheDocument()
//     const listItem = getByTestId('item-AUD')
//     user.click(listItem)
//     // store has expected state
//     expect(dropdownDiv).toHaveTextContent(store.getState().app.selectedFrom!.name)
//     expect(getByTestId('pocket-from')).toHaveTextContent(store.getState().app.pocketValueFrom)
//     // renders expected UI
//     expect(store.getState().app.selectedFrom!.name).toBe(currencies[2].name)
//     expect(store.getState().app.pocketValueFrom).toBe(fPocket(currencies[2].value))
//   })

//   test('select currency TO', () => {
//     const {getByTestId, queryByTestId, store} = render(<App />, {...props})
//     const dropdownList = queryByTestId('dropdown-list-to')
//     expect(dropdownList).toBeNull()
//     const dropdownDiv = getByTestId('dropdown-to')
//     user.click(dropdownDiv)
//     expect(getByTestId('dropdown-list-to')).toBeInTheDocument()
//     const listItem = getByTestId('item-AUD')
//     user.click(listItem)
//     // store has expected state
//     expect(dropdownDiv).toHaveTextContent(store.getState().app.selectedTo!.name)
//     expect(getByTestId('pocket-to')).toHaveTextContent(store.getState().app.pocketValueTo)
//     // renders expected UI
//     expect(store.getState().app.selectedTo!.name).toBe(currencies[2].name)
//     expect(store.getState().app.pocketValueTo).toBe(fPocket(currencies[2].value))
//   })
// })

// describe('button enabled/disabled', () => {
//   it('button is disabled', () => {
//     const {getAllByText} = render(<App />, {canSubmit: false})
//     const allBtn = getAllByText(/continue/i)
//     const button = allBtn[0] as HTMLInputElement
//     expect(button.disabled).toBeTruthy()
//   })

//   it('button is enabled', () => {
//     const {getAllByText} = render(<App />, {canSubmit: true})
//     const allBtn = getAllByText(/continue/i)
//     const button = allBtn[0] as HTMLInputElement
//     expect(button.disabled).toBeFalsy()
//   })
// })

// // it('swaps currency FROM with currency TO', () => {})

// // it('changes input value TO and pocket value TO when currency change', () => {})

// // it('search dropdown list for currencies', () => {})
