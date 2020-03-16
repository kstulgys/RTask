import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, waitForElement, cleanup, wait, waitForElementToBeRemoved, act} from 'lib/utils/testing-utils';
import {setInitialData, handleCurencyRateChange, InitialDataPayload} from 'context/actions';
import {CurrencyExchange} from '.';
import {StatusTypes} from 'context/types';
import {initialState} from 'context';
import {appReducer} from 'context/reducer';
import {ActionTypes} from 'context/actionTypes';

afterEach(cleanup);

jest.mock('context/actions');

beforeEach(() => {
  jest.clearAllMocks();
});

let state = initialState;

it('app renders with spinner', async () => {
  const {getByTestId} = render(<CurrencyExchange />, {state});
  expect(getByTestId('loader')).toBeInTheDocument();
});

it('app renders after SET_INITIAL_DATA_SUCCESS', () => {
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
  state = appReducer(state, {type: ActionTypes.SET_INITIAL_DATA_SUCCESS, payload});
  const {debug, getByText, queryByTestId, getByTestId} = render(<CurrencyExchange />, {
    state,
  });
  expect(setInitialData).toHaveBeenCalledTimes(1);
  expect(queryByTestId(/loader/i)).toBeNull();
  expect(getByText(/exchange money/i)).toBeInTheDocument();
  expect(queryByTestId('input-from')).toBeInTheDocument();
  expect(queryByTestId('input-to')).toBeInTheDocument();
  expect(queryByTestId('pocket-from')).toBeInTheDocument();
  expect(queryByTestId('pocket-to')).toBeInTheDocument();
  // expect(getByTestId('continue')).toBeInTheDocument();
  // const button = getByTestId('continue').closest();
  // debug(button);
});
