import * as React from 'react'
import { render } from 'utils/testing'
import { CurrencyMetadata } from '.'
import useStore from 'store'
import '@testing-library/jest-dom/extend-expect'

const initialState = {
  dataPoints: {
    value: [],
  },
  currentRate: {
    value: 0,
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
  const { queryByTestId, ...rest } = render(<CurrencyMetadata />)
  const todaysChange = queryByTestId(/current-change/i)
  const currentRate = queryByTestId(/current-rate/i)

  return { currentRate, todaysChange, ...rest }
}

test('does not render TodaysChange with no value', () => {
  const { todaysChange } = setup(initialState)
  expect(todaysChange).not.toBeInTheDocument()
})

test('does not render TodaysChange with no value', () => {
  const { todaysChange } = setup(initialState)
  expect(todaysChange).not.toBeInTheDocument()
})

test('does not render CurrentRate with one value', () => {
  const { todaysChange } = setup({
    ...initialState,
    dataPoints: {
      value: [{ x: 1, y: 1 }],
    },
  })
  expect(todaysChange).not.toBeInTheDocument()
})

test('renders TodaysChange', () => {
  const { todaysChange, debug } = setup({
    ...initialState,
    dataPoints: {
      value: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ],
    },
  })

  const change: number = 2 - 1
  const percent = (change * 100) / 2
  const result = `${Math.abs(change).toFixed(4)} (${percent.toFixed(2)} %)`
  expect(todaysChange).toBeInTheDocument()
  expect(todaysChange?.innerHTML).toContain(result)
})

test('does not render CurrentRate', () => {
  const { currentRate } = setup(initialState)
  expect(currentRate).not.toBeInTheDocument()
})

test('renders CurrentRate', () => {
  const { currentRate } = setup({
    ...initialState,
    currentRate: {
      value: 1.111,
    },
  })
  expect(currentRate).toBeInTheDocument()
  expect(currentRate?.innerHTML).toContain('1.111')
})
