import * as React from 'react'
import { render } from 'utils/testing'
import user from '@testing-library/user-event'
import { Dropdown } from '.'
import useStore from 'store'
import '@testing-library/jest-dom/extend-expect'
import { fPocket } from 'utils/helpers'

const currencies = [
  { name: 'GBP', value: 10000.99 },
  { name: 'USD', value: 20000.33 },
  { name: 'AUD', value: 30000.99 },
  { name: 'LTU', value: 40000.33 },
]

const initialState = {
  selectedFrom: currencies[0],
  selectedTo: currencies[1],
  currencies: {
    value: currencies,
  },
  pocketValueFrom: currencies[0].value.toString(),
  pocketValueTo: currencies[1].value.toString(),
  actions: {
    handleSelectFrom: jest.fn(),
    handleSelectTo: jest.fn(),
  },
}

jest.mock('../../app/store')
afterEach(() => {
  useStore.mockClear()
})

const setup = (label: 'From' | 'To', partialState?: any) => {
  useStore.mockImplementation((callback: any) => {
    return callback(partialState)
  })
  return render(<Dropdown label={label} />)
}

test('renders dwopdown label', () => {
  const label = 'From'
  const { getByText } = setup(label, initialState)
  getByText(label)
})

test('renders selected from currency name', () => {
  const label = 'From'
  const { getByText } = setup(label, initialState)
  getByText(initialState.selectedFrom.name)
})

test('renders selected from pocket value', () => {
  const label = 'From'
  const { getByText } = setup(label, initialState)
  getByText(fPocket(initialState.pocketValueFrom))
})

test('onClick opens dropdown currency list', async () => {
  const label = 'From'
  const { getByTestId, queryByTestId } = setup(label, initialState)
  const dropDownClickDiv = getByTestId(/dropdown-from/i)
  expect(queryByTestId(/dropdown-list-from/i)).not.toBeInTheDocument()
  user.click(dropDownClickDiv)
  const itemList = await queryByTestId(/dropdown-list-from/i)
  expect(itemList).toBeInTheDocument()
})
