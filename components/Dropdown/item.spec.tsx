import * as React from 'react'
import {render, fireEvent} from 'utils/testing'
import user from '@testing-library/user-event'
import CurrencyItem from './CurrencyItem'
import '@testing-library/jest-dom/extend-expect'
import {fPocket} from 'utils/helpers'

const props = {
  handleSelect: jest.fn(),
  handleOnKeyUp: jest.fn(),
  item: {name: 'GBP', value: '1000'},
}
const setup = () => {
  return render(<CurrencyItem {...props} />)
}

test('renders item name', () => {
  const {getByText} = setup()
  getByText(/GBP/i)
})

test('renders item value', () => {
  const {getByText} = setup()
  getByText(fPocket(props.item.value.toString()))
})

test('onClick calls handleSelect', () => {
  const {getByTestId} = setup()
  user.click(getByTestId(/item-GBP/i))
  expect(props.handleSelect).toHaveBeenCalledWith(props.item)
  expect(props.handleSelect).toHaveBeenCalledTimes(1)
})
