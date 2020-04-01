import * as React from 'react'
import App from 'app/App'
import {render, cleanup, fireEvent, act, wait, waitForElement, queryByTestId} from 'utils/testing'
import user from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import {filterList, fPocket} from 'utils/helpers'
import {initialState, submitValues} from 'app/appSlice'
// import {getCurrencies} from 'api/currenciesAPI';

beforeEach(cleanup)

describe('Layout', () => {
  it('has loader visible', async () => {
    const {getByTestId, debug, store} = render(<App />, {...initialState})
    expect(getByTestId('loader')).toBeInTheDocument()
  })

  it('has no loader when data is loaded', async () => {
    const {queryByTestId, debug} = render(<App />)
    expect(queryByTestId(/loader/i)).toBeNull()
  })

  it('has title"', () => {
    const {getByText} = render(<App />)
    expect(getByText(/exchange money/i)).toBeInTheDocument()
  })

  it('has labels "From" and "to"', () => {
    const {getByText, getByTestId} = render(<App />)
    expect(getByText('From')).toBeInTheDocument()
    expect(getByText('To')).toBeInTheDocument()
  })

  it('has dropdown components"', () => {
    const {getByTestId} = render(<App />)
    expect(getByTestId('dropdown-from')).toBeInTheDocument()
    expect(getByTestId('dropdown-to')).toBeInTheDocument()
  })

  it('has pocket values"', () => {
    const {getByTestId} = render(<App />)
    expect(getByTestId('pocket-from')).toBeInTheDocument()
    expect(getByTestId('pocket-to')).toBeInTheDocument()
  })
  it('has input fields"', () => {
    const {getByTestId} = render(<App />)
    expect(getByTestId('input-from')).toBeInTheDocument()
    expect(getByTestId('input-to')).toBeInTheDocument()
  })
  it('has submit/continue button"', () => {
    const {getAllByText} = render(<App />)
    const buttons = getAllByText(/continue/i)
    // one is hidden for mobile and vice versa
    expect(buttons).toHaveLength(2)
  })
  it('has current rate"', () => {
    const {getByTestId} = render(<App />)
    expect(getByTestId('current-rate')).toBeInTheDocument()
  })

  it('has current change"', async () => {
    const {getByTestId} = render(<App />)
    expect(getByTestId('current-change')).toBeInTheDocument()
  })

  it('has "swapp" button"', () => {
    const {getByTestId} = render(<App />)
    expect(getByTestId('button-swap')).toBeInTheDocument()
  })
})

describe('Input change', () => {
  const state = {
    selectedFrom: {name: 'GBP', value: 51234},
    selectedTo: {name: 'USD', value: 71234},
    currentRate: 1.1,
    pocketValueFrom: 51234,
    pocketValueTo: 71234,
    inputValueFrom: '',
    inputValueTo: '',
  }

  let inputFrom: HTMLInputElement, inputTo: HTMLInputElement, pocketFrom: HTMLElement, pocketTo: HTMLElement
  let newValue: string
  const setup = () => {
    const {getByTestId, store} = render(<App />, {...state})
    inputFrom = getByTestId('input-from') as HTMLInputElement
    inputTo = getByTestId('input-to') as HTMLInputElement
    pocketFrom = getByTestId('pocket-from')
    pocketTo = getByTestId('pocket-to')
    newValue = '5000.43'
    expect(inputFrom.value).toBe('')
    expect(inputTo.value).toBe('')
    expect(pocketFrom).toHaveTextContent(fPocket(state.pocketValueFrom))
    expect(pocketTo).toHaveTextContent(fPocket(state.pocketValueTo))
    return store
  }

  test('on input FROM change - pdates input value FROM, input value TO, pocket value FROM, pocket value TO', () => {
    const store = setup()
    user.type(inputFrom, newValue)
    // updates input FROM value
    expect(inputFrom.value).toBe(store.getState().app.inputValueFrom)
    // updates input TO value
    expect(inputTo.value).toBe(store.getState().app.inputValueTo)
    // updates pocket FROM value
    expect(pocketFrom).toHaveTextContent(fPocket(store.getState().app.pocketValueFrom))
    // updates pocket TO value
    expect(pocketTo).toHaveTextContent(fPocket(store.getState().app.pocketValueTo))
  })

  it('on input TO change - udates input value FROM, input value TO, pocket value FROM, pocket value TO', () => {
    const store = setup()
    user.type(inputTo, newValue)
    // updates input FROM value
    expect(inputFrom.value).toBe(store.getState().app.inputValueFrom)
    // updates input TO value
    expect(inputTo.value).toBe(store.getState().app.inputValueTo)
    // updates pocket FROM value
    expect(pocketFrom).toHaveTextContent(fPocket(store.getState().app.pocketValueFrom))
    // updates pocket TO value
    expect(pocketTo).toHaveTextContent(fPocket(store.getState().app.pocketValueTo))
  })
})

const currencies = [
  {name: 'GBP', value: 10000.99},
  {name: 'USD', value: 20000.33},
  {name: 'AUD', value: 30000.99},
  {name: 'LTU', value: 40000.33},
]
describe('select currency', () => {
  const props = {
    pocketValueFrom: currencies[0].value,
    pocketValueTo: currencies[1].value,
    selectedFrom: currencies[0],
    selectedTo: currencies[1],
    currencies: currencies,
  }
  test('select currency FROM', () => {
    const {getByTestId, queryByTestId, debug, store} = render(<App />, {
      ...props,
    })
    const dropdownList = queryByTestId('dropdown-list-from')
    expect(dropdownList).toBeNull()
    const dropdownDiv = getByTestId('dropdown-from')
    user.click(dropdownDiv)
    expect(getByTestId('dropdown-list-from')).toBeInTheDocument()
    const listItem = getByTestId('item-AUD')
    user.click(listItem)
    // store has expected state
    expect(dropdownDiv).toHaveTextContent(store.getState().app.selectedFrom!.name)
    expect(getByTestId('pocket-from')).toHaveTextContent(fPocket(store.getState().app.pocketValueFrom))
    // renders expected UI
    expect(store.getState().app.selectedFrom!.name).toBe(currencies[2].name)
    expect(store.getState().app.pocketValueFrom).toBe(currencies[2].value)
  })

  test('select currency TO', () => {
    const {getByTestId, queryByTestId, store} = render(<App />, {...props})
    const dropdownList = queryByTestId('dropdown-list-to')
    expect(dropdownList).toBeNull()
    const dropdownDiv = getByTestId('dropdown-to')
    user.click(dropdownDiv)
    expect(getByTestId('dropdown-list-to')).toBeInTheDocument()
    const listItem = getByTestId('item-AUD')
    user.click(listItem)
    // store has expected state
    expect(dropdownDiv).toHaveTextContent(store.getState().app.selectedTo!.name)
    expect(getByTestId('pocket-to')).toHaveTextContent(fPocket(store.getState().app.pocketValueTo))
    // renders expected UI
    expect(store.getState().app.selectedTo!.name).toBe(currencies[2].name)
    expect(store.getState().app.pocketValueTo).toBe(currencies[2].value)
  })
})

describe('button enabled/disabled', () => {
  it('button is disabled', () => {
    const {getAllByText} = render(<App />, {canSubmit: false})
    const allBtn = getAllByText(/continue/i)
    const button = allBtn[0] as HTMLInputElement
    expect(button.disabled).toBeTruthy()
  })

  it('button is enabled', () => {
    const {getAllByText} = render(<App />, {canSubmit: true})
    const allBtn = getAllByText(/continue/i)
    const button = allBtn[0] as HTMLInputElement
    expect(button.disabled).toBeFalsy()
  })
})

// it('swaps currency FROM with currency TO', () => {})

// it('changes input value TO and pocket value TO when currency change', () => {})

// it('search dropdown list for currencies', () => {})
