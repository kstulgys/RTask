import * as React from 'react'
import {render} from 'utils/testing'
import user from '@testing-library/user-event'
import {CurrencyChangeChart} from '.'
import useStore from 'app/store'
import '@testing-library/jest-dom/extend-expect'

const initialState = {
  dataPoints: {
    value: [],
  },
}

jest.mock('../../app/store')
afterEach(() => {
  useStore.mockClear()
})

const setup = (partialState: any) => {
  useStore.mockImplementation((callback: any) => {
    return callback(partialState)
  })
  const {queryByTestId, ...rest} = render(<CurrencyChangeChart />)
  const chart = queryByTestId(/chart/i)

  return {chart, ...rest}
}

test('does not render CurrencyChangeChart with no value', () => {
  const {chart} = setup(initialState)
  expect(chart).not.toBeInTheDocument()
})

test('does not render CurrencyChangeChart with one value', () => {
  const {chart} = setup({
    ...initialState,
    dataPoints: {
      value: [{x: 1, y: 1}],
    },
  })
  expect(chart).not.toBeInTheDocument()
})

test('renders CurrencyChangeChart"', () => {
  const {chart} = setup({
    ...initialState,
    dataPoints: {
      value: [
        {x: 1, y: 1},
        {x: 2, y: 2},
      ],
    },
  })
  expect(chart).toBeInTheDocument()
})
