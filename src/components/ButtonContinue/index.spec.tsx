import * as React from 'react'
import {render} from 'utils/testing'
import user from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import {ButtonContinue} from '.'
import useStore from 'app/store'

const initialState = {
  canSubmit: false,
  submitValues: {
    isSubmitting: false,
  },
  asyncActions: {
    handleSubmitValues: jest.fn(),
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
  const {getByText, ...rest} = render(<ButtonContinue />)
  const button = getByText(/continue/i)

  return {button, ...rest}
}

test('has submit/continue button"', () => {
  const {button} = setup(initialState)
  expect(button).toBeInTheDocument()
})

test('useStore has been called 3 times', () => {
  setup(initialState)
  expect(useStore).toBeCalledTimes(3)
})

test('button is  disabled', () => {
  const {button} = setup(initialState)
  expect(button.disabled).toBeTruthy()
})

test('button is enabled', () => {
  const {button} = setup({...initialState, canSubmit: true})
  expect(button.disabled).toBeFalsy()
})

test('onClick does not call handleSubmitValues', () => {
  const {button} = setup(initialState)
  user.click(button)
  expect(initialState.asyncActions.handleSubmitValues).toBeCalledTimes(0)
})

test('onClick calls handleSubmitValues', async () => {
  const {button} = setup({...initialState, canSubmit: true})
  user.click(button)
  expect(initialState.asyncActions.handleSubmitValues).toBeCalledTimes(1)
})
