import {
  getSelected,
  getCanSubmit,
  isValidInput,
  formatHistoryData,
  getTimestamp,
  getInputValueTo,
  getInputValueFrom,
  getPocketValueTo,
  getPocketValueFrom,
  getEndAtDay,
  getStartAtDay,
  getFiltered,
  waait,
} from 'utils/helpers'
import '@testing-library/jest-dom/extend-expect'

const currencies = [
  {name: 'EUR', value: 0},
  {name: 'GBP', value: 0},
  {name: 'USD', value: 0},
]

test('getSelected', () => {
  const expected = {name: 'GBP', value: 0}
  const selected = getSelected('GBP', currencies)
  expect(selected).toEqual(expected)
})

test('getCanSubmit', () => {
  expect(getCanSubmit({pocketValueFrom: '10000', inputValueFrom: '5000'})).toBeTruthy()
  expect(getCanSubmit({pocketValueFrom: '-10000', inputValueFrom: '5000'})).toBeFalsy()
})

test('getCanSubmit', () => {
  expect(isValidInput('-1234')).toBeFalsy()
  expect(isValidInput('-1234.123')).toBeFalsy()
  expect(isValidInput('1234.123')).toBeFalsy()
  expect(isValidInput('1234.123')).toBeFalsy()
  expect(isValidInput('Infinity')).toBeFalsy()
  expect(isValidInput('-1234.123')).toBeFalsy()
  expect(isValidInput('1234.12')).toBeTruthy()
  expect(isValidInput('37846376473647836478364.12')).toBeTruthy()
})

describe('formatHistoryData and getTimestamp', () => {
  test('not empty', () => {
    const data = {
      rates: {
        '11-01-2013': {EUR: 1.1},
        '12-01-2013': {EUR: 1.1},
        '10-01-2013': {EUR: 1.1},
      },
    }
    const selectedTo = 'EUR'
    const expected = [
      {x: getTimestamp('10-01-2013'), y: 1.1},
      {x: getTimestamp('11-01-2013'), y: 1.1},
      {x: getTimestamp('12-01-2013'), y: 1.1},
    ]
    expect(formatHistoryData({data, selectedTo})).toEqual(expected)
  })

  test('getInputValueTo', () => {
    const result = getInputValueTo('100.12', 1.1234)
    expect(result).toBe('112.47')
  })
  test('getInputValueFrom', () => {
    const result = getInputValueFrom('100.12', 1.1234)
    expect(result).toBe('89.12')
  })
  test('getPocketValueTo', () => {
    const result = getPocketValueTo(100.12, '100.12')
    expect(result).toBe('200.24')
  })
  test('getPocketValueFrom', () => {
    const result = getPocketValueFrom(100.12, '100.12')
    expect(result).toBe('00.00')
  })
})
