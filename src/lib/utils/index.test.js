import '@testing-library/jest-dom/extend-expect';

import {getSelected, getCanSubmit, getPocketValue, getInputValue} from 'lib/utils';

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
  expect(getCanSubmit({selectedFromPocketValue: 10000, inputValueFrom: 5000})).toBeTruthy();
  expect(getCanSubmit({selectedFromPocketValue: -10000, inputValueFrom: 5000})).toBeFalsy();
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
