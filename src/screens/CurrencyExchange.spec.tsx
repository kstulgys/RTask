import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, waitForElement, cleanup, wait, waitForElementToBeRemoved, act} from 'lib/utils/testing-utils';
import {CurrencyExchange} from '.';
import {StatusTypes} from 'context/types';
import {initialState} from 'context';
import {appReducer} from 'context/reducer';
import {ActionTypes} from 'context/actionTypes';
import {
  handleInputValueFromChange,
  handleInputValueToChange,
  handleCurencyRateChange,
  handleCurrenciesSwapp,
  selectFromCurrency,
  selectToCurrency,
  handleValuesSubmit,
  SubmitValuesPayload,
  InitialDataPayload,
  setInitialData,
} from 'context/actions';

afterEach(cleanup);

jest.mock('context/actions');

beforeEach(() => {
  jest.clearAllMocks();
});

const state = initialState;

it('app renders with spinner', async () => {
  const {getByTestId} = render(<CurrencyExchange />, {state});
  expect(getByTestId('loader')).toBeInTheDocument();
});

// it('app renders after SET_INITIAL_DATA_SUCCESS', () => {
//   // SET_INITIAL_DATA_SUCCESS
//   const payload: InitialDataPayload = {
//     pocketValueTo: 1000,
//     pocketValueFrom: 2000,
//     isLoading: false,
//     currencies: [],
//     selectedFrom: {name: 'GBP', value: 2000},
//     selectedTo: {name: 'USD', value: 1000},
//     currentRate: 1.111,
//     dataPoints: [{x: 1, y: 2}],
//     status: StatusTypes.idle,
//   };
//   state = appReducer(state, {type: ActionTypes.SET_INITIAL_DATA_SUCCESS, payload});
//   const {debug, getByText, queryByTestId, getByTestId, rerender} = render(<CurrencyExchange />, {
//     state,
//   });
//   expect(setInitialData).toHaveBeenCalledTimes(1);
// expect(queryByTestId(/loader/i)).toBeNull();
// expect(getByText(/exchange money/i)).toBeInTheDocument();
// expect(getByTestId('input-from')).toBeInTheDocument();
// expect(getByTestId('input-to')).toBeInTheDocument();
// expect(getByTestId('pocket-from')).toBeInTheDocument();
// expect(getByTestId('pocket-to')).toBeInTheDocument();
// expect(getByTestId('continue')).toBeInTheDocument();
// const button = getByTestId('continue').closest();
// debug(button);
// });

const fromInputProps = {
  inputValue: 0,
  selected: {name: 'GBP', value: 2000},
  autoFocus: true,
  handleChange: jest.fn(),
};

const toInputProps = {
  inputValue: 0,
  selected: {name: 'USD', value: 1000},
  autoFocus: false,
  handleChange: jest.fn(),
};

// describe('on From input value change', () => {
//   it('chanages From pocket value', () => {
//     const {debug, getByTestId} = render(<InputAmount {...fromInputProps} />);
//     <CurrencyExchange />, {
//       state,
//     }
//     const input = getByTestId('input-from');
//     const pocketValue =
//     user.type(input, '12345.67');
//     debug();
//   });
// });

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

describe('setInitialData', () => {
  const dispatch = jest.fn();
  const newState = appReducer(initialState, {type: ActionTypes.SET_INITIAL_DATA_SUCCESS, payload});
  it('setInitialData updates state', () => {
    render(<CurrencyExchange />, {
      state: newState,
    });
    setInitialData(dispatch);
    expect(setInitialData).toBeCalledWith(dispatch);
    expect({...initialState, ...newState}).toEqual(newState);
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
});
