import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, waitForElement, cleanup, wait, waitForElementToBeRemoved, act} from 'lib/utils/testing-utils';
import {setInitialData, handleCurencyRateChange, InitialDataPayload} from '../context/actions';

import {CurrencyExchange} from '.';
import {StatusTypes} from 'context/types';
import {initialState} from 'context';
import {appReducer} from 'context/reducer';
import {ActionTypes} from 'context/actionTypes';

beforeEach(cleanup);

// jest.mock('', () => {
//   setInitialData: jest.fn();
//   handleCurencyRateChange: jest.fn();
// });

// SET_INITIAL_DATA_SUCCESS
const payload: InitialDataPayload = {
  pocketValueTo: 1000,
  pocketValueFrom: 2000,
  isLoading: false,
  currencies: [],
  selectedFrom: {name: 'GBP', value: 2000},
  selectedTo: {name: 'USD', value: 1000},
  currentRate: 1.111,
  dataPoints: [{x: 1, y: 2}],
  status: StatusTypes.idle,
};

let state = initialState;

test('calls action setInitialData', async () => {
  render(<CurrencyExchange />, {state});
  expect(setInitialData).toHaveBeenCalledTimes(1);
});

test('app renders with spinner', async () => {
  const {getByTestId} = render(<CurrencyExchange />, {state});
  expect(getByTestId('loader')).toBeInTheDocument();
});

test('app renders after SET_INITIAL_DATA_SUCCESS', async () => {
  state = appReducer(state, {type: ActionTypes.SET_INITIAL_DATA_SUCCESS, payload});
  const {debug, getByText, queryByTestId} = render(<CurrencyExchange />, {state});
  expect(queryByTestId(/loader/i)).toBeNull();
  expect(getByText(/exchange money/i)).toBeInTheDocument();
  debug();
});

// it('shows spinner on initial render', () => {
//   const {getByTestId, debug} = render(<CurrencyExchange />, {state, dispatch});
//   expect(getByTestId('loader')).toBeInTheDocument();
// });
// it('removes spinner', async () => {
//   const newState = {...state, isLoading: false};
//   const {getByText, debug, queryByTestId} = render(<CurrencyExchange />, {state: newState});
//   expect(queryByTestId(/loader/i)).toBeNull();
//   expect(getByText(/exchange money/i)).toBeInTheDocument();
// });

// describe('Renders expected Layout after initial data is received', () => {
// const newState = {
//   ...state,
//   pocketValueTo: 50000.12,
//   pocketValueFrom: 50000.12,
//   isLoading: false,
//   currencies: {name: 'EUR', value: 50000.12},
//   selectedFrom: {name: 'GBP', value: 50000.12},
//   selectedTo: {name: 'USD', value: 50000.12},
//   currentRate: 1.236,
//   dataPoints: [{x: 1, y: 2}],
//   status: StatusTypes.idle,
// };
//   const {getByText, debug, queryByTestId} = render(<CurrencyExchange />, {state: newState});
// });

// expect(setInitialData).toHaveBeenCalledTimes(1);
// expect(handleCurencyRateChange).toHaveBeenCalledTimes(1);
