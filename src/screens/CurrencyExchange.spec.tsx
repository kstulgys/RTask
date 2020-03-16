import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, cleanup} from 'lib/utils/testing-utils';
import {CurrencyExchange} from './CurrencyExchange';
import {StatusTypes} from 'context/types';
import {initialState} from 'context';
import {appReducer} from 'context/reducer';
import {ActionTypes} from 'context/actionTypes';
import {
  handleCurencyRateChange,
  handleInputValueFromChange,
  handleInputValueToChange,
  handleCurrenciesSwapp,
  InitialDataPayload,
  setInitialData,
  handleValuesSubmit,
} from 'context/actions';
import user from '@testing-library/user-event';

afterEach(cleanup);
jest.mock('context/actions');
beforeEach(() => {
  jest.clearAllMocks();
});

it('app renders with spinner', async () => {
  const {getByTestId} = render(<CurrencyExchange />, {state: initialState});
  expect(getByTestId('loader')).toBeInTheDocument();
});

const payload: InitialDataPayload = {
  pocketValueTo: 1000,
  pocketValueFrom: 2000,
  isLoading: false,
  currencies: [],
  selectedFrom: {name: 'GBP', value: 2000},
  selectedTo: {name: 'USD', value: 1000},
  currentRate: 1.111,
  dataPoints: [
    {x: 1, y: 2},
    {x: 1, y: 2},
  ],
  status: StatusTypes.idle,
};

const dispatch = jest.fn();
const newState = appReducer(initialState, {type: ActionTypes.SET_INITIAL_DATA_SUCCESS, payload});
it('setInitialData updates state', () => {
  render(<CurrencyExchange />, {
    state: newState,
  });
  setInitialData(dispatch);
  expect(setInitialData).toBeCalledWith(dispatch);
  expect({...initialState, ...newState}).toEqual(newState);
  expect(handleCurencyRateChange).toBeCalled();
});

it('renders DOM elements', async () => {
  const {debug, getByText, queryByTestId, getByTestId} = render(<CurrencyExchange />, {state: newState});
  expect(queryByTestId(/loader/i)).toBeNull();
  expect(getByText(/exchange money/i)).toBeInTheDocument();
  expect(getByTestId('input-from')).toBeInTheDocument();
  expect(getByTestId('input-to')).toBeInTheDocument();
  expect(getByTestId('pocket-from')).toBeInTheDocument();
  expect(getByTestId('pocket-to')).toBeInTheDocument();
  expect(getByTestId('current-rate')).toBeInTheDocument();
  expect(getByTestId('current-change')).toBeInTheDocument();
  expect(getByTestId('button-swap')).toBeInTheDocument();
  expect(getByTestId('dropdown-from')).toBeInTheDocument();
  expect(getByTestId('dropdown-to')).toBeInTheDocument();
});

it('calls handleInputValueFromChange', () => {
  const newState = appReducer(initialState, {type: ActionTypes.SET_INITIAL_DATA_SUCCESS, payload});
  const {getByTestId} = render(<CurrencyExchange />, {
    state: newState,
  });

  const input = getByTestId('input-from');
  user.type(input, '1234.56');
  expect(handleInputValueFromChange).toBeCalled();
});

it('calls handleInputValueToChange', () => {
  const newState = appReducer(initialState, {type: ActionTypes.SET_INITIAL_DATA_SUCCESS, payload});
  const {getByTestId} = render(<CurrencyExchange />, {
    state: newState,
  });
  const input = getByTestId('input-to');
  user.type(input, '1234.56');
  expect(handleInputValueToChange).toBeCalled();
});

it('calls handleCurrenciesSwapp', () => {
  const newState = appReducer(initialState, {type: ActionTypes.SET_INITIAL_DATA_SUCCESS, payload});
  const {getByTestId} = render(<CurrencyExchange />, {
    state: newState,
  });
  const button = getByTestId('button-swap');
  user.click(button);
  expect(handleCurrenciesSwapp).toBeCalled();
});
