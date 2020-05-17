import * as React from 'react'
import { render } from 'utils/testing'
import user from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import { IconSwapInputs } from '.'
import useStore from 'store'

const initialState = {
  selectedTo: { name: 'GBP' },
  selectedFrom: { name: 'USD' },
  actions: {
    handleSwapCurrencies: jest.fn(),
  },
}

jest.mock('../../app/store')
afterEach(() => {
  useStore.mockClear()
})

const setup = () => {
  useStore.mockImplementation((callback: any) => {
    return callback(initialState)
  })
  return render(<IconSwapInputs />)
}

test('has submit/continue button"', async () => {
  const { getByTestId } = setup()
  expect(useStore).toBeCalledTimes(3)
  const button = getByTestId('button-swap')
  user.click(button)

  expect(initialState.actions.handleSwapCurrencies).toBeCalledTimes(1)
})
