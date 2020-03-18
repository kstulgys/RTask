import {
  getSelected,
  getPocketValue,
  getInputValue,
  getCanSubmit,
  isValidInput,
  formatHistoryData,
  getTimestamp,
  getEndAtDay,
  getStartAtDay,
  getFiltered,
  randomNumber,
  waait,
} from 'utils/helpers';
import '@testing-library/jest-dom/extend-expect';

const currencies = [
  {name: 'EUR', value: 0},
  {name: 'GBP', value: 0},
  {name: 'USD', value: 0},
];

test('getSelected', () => {
  const expected = {name: 'GBP', value: 0};
  const selected = getSelected('GBP', currencies);
  expect(selected).toEqual(expected);
});

test('getCanSubmit', () => {
  expect(getCanSubmit({pocketValueFrom: 10000, inputValueFrom: 5000})).toBeTruthy();
  expect(getCanSubmit({pocketValueFrom: -10000, inputValueFrom: 5000})).toBeFalsy();
});

test('getPocketValue', () => {
  expect(getPocketValue('From', 2000, 1000)).toBe(1000);
  expect(getPocketValue('From', -2000, 1000)).toBe(-3000);
  expect(getPocketValue('To', 2000, 1000)).toBe(3000);
  expect(getPocketValue('To', -2000, 1000)).toBe(-1000);
});

test('getInputValue', () => {
  const currentRate = 1.145;
  const result1 = getInputValue('From', currentRate, '1000.33');
  const result2 = getInputValue('From', currentRate, 1000.33);
  expect(result1).toEqual(result2);

  const result3 = getInputValue('To', currentRate, '1000.33');
  const result4 = getInputValue('To', currentRate, 1000.33);
  expect(result3).toEqual(result4);
});

test('getCanSubmit', () => {
  expect(isValidInput(-1234)).toBeFalsy();
  expect(isValidInput(-1234.123)).toBeFalsy();
  expect(isValidInput(1234.123)).toBeFalsy();
  expect(isValidInput(Infinity)).toBeFalsy();
  expect(isValidInput(-Infinity)).toBeFalsy();
  expect(isValidInput('1234.123')).toBeFalsy();
  expect(isValidInput('Infinity')).toBeFalsy();
  expect(isValidInput('-1234.123')).toBeFalsy();

  expect(isValidInput('1234.12')).toBeTruthy();
  expect(isValidInput('37846376473647836478364.12')).toBeTruthy();
});

describe('formatHistoryData and getTimestamp', () => {
  test('empty', () => {
    const data = {rates: {}};
    const selectedTo = [];
    expect(formatHistoryData({data, selectedTo})).toEqual([]);
  });

  test('not empty', () => {
    const data = {
      rates: {
        '11-01-2013': {EUR: 1.1},
        '12-01-2013': {EUR: 1.1},
        '10-01-2013': {EUR: 1.1},
      },
    };
    const selectedTo = 'EUR';
    const expected = [
      {x: getTimestamp('10-01-2013'), y: 1.1},
      {x: getTimestamp('11-01-2013'), y: 1.1},
      {x: getTimestamp('12-01-2013'), y: 1.1},
    ];
    expect(formatHistoryData({data, selectedTo})).toEqual(expected);
  });
});
