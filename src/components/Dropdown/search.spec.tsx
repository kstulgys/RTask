import * as React from 'react'
import {render} from 'utils/testing'
import user from '@testing-library/user-event'
import SearchCurrencyInput from './SearchCurrencyInput'
import '@testing-library/jest-dom/extend-expect'

const props = {
  handleSearch: jest.fn(),
  searchTerm: '1',
}
const setup = () => {
  return render(<SearchCurrencyInput {...props} />)
}

test('change input value', async () => {
  const newInputValue = '1234.23'
  const {getByPlaceholderText} = setup()
  const input = getByPlaceholderText(/search/i)
  expect(input.value).toBe(props.searchTerm)
  user.type(input, newInputValue)
  expect(props.handleSearch).toHaveBeenCalledWith('1' + newInputValue)
  expect(props.handleSearch).toHaveBeenCalledTimes(7)
})
