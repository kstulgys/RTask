import * as React from 'react'
import { render } from 'utils/testing'
import user from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import { InputAmount } from '.'
import useStore from 'store'

const state = {
  selectedTo: { name: 'GBP', value: '1000' },
  selectedFrom: { name: 'USD', value: '1000' },
  inputValueFrom: '50',
  inputValueTo: '50',
  actions: {
    handleInputChangeFrom: jest.fn(),
    handleInputChangeTo: jest.fn(),
  },
}

jest.mock('../../app/store')
afterEach(() => {
  useStore.mockClear()
})

const props = {
  label: 'From',
  autoFocus: true,
}

const setup = () => {
  useStore.mockImplementation((callback: any) => {
    return callback(state)
  })

  return render(<InputAmount {...props} />)
}

test('has input value', async () => {
  const { getByPlaceholderText } = setup()
  const input = getByPlaceholderText('0')
  expect(input.value).toContain(state.inputValueFrom)
})

test('calls handleChange', async () => {
  const { getByPlaceholderText } = setup()
  const input = getByPlaceholderText('0')
  user.type(input, '123')
  expect(state.actions.handleInputChangeFrom).toBeCalledWith('50123')
})
