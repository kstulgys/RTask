/* eslint-disable react/prop-types */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, waitForElement, cleanup, wait, waitForElementToBeRemoved, waitFor, act} from 'lib/utils/testing-utils';
import {setInitialData, handleCurencyRateChange} from '../context/actions';
// import * as actions from '../context/actions';

import {CurrencyExchange} from './';
import {StatusTypes} from 'context/types';
import {initialState} from 'context';
import {appReducer} from 'context/reducer';
import {ActionTypes} from 'context/actionTypes';
// beforeEach(cleanup);

// let state = {
//   isLoading: true,
//   isSubmitting: false,
//   pocketValueFrom: 0,
//   pocketValueTo: 0,
//   canSubmit: false,
//   selectedFrom: null,
//   selectedTo: null,
//   currencies: [],
//   dataPoints: [],
//   currentRate: 0,
//   inputValueFrom: 0,
//   inputValueTo: 0,
//   status: {name: 'idle', message: ''},
// };

const mockDispatch = ({type, payload}) => {
  const newState = appReducer(state, {type, payload});
  state = {...state, ...newState};
};

jest.mock('../context/actions', () => ({
  setInitialData: jest.fn(),
  handleCurencyRateChange: jest.fn(),
}));

const payload = {
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

test('setInitialData fn is called in useEffect hook in the provider', async () => {
  const {debug} = render(<CurrencyExchange />);
  expect(setInitialData).toHaveBeenCalledTimes(1);

  // dispatch({
  //   type: ActionTypes.SET_INITIAL_DATA_SUCCESS,
  //   payload,
  // });

  // expect(dispatch).toHaveBeenCalled();
  // console.log({state});
  // container.debug();
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
//   const newState = {
//     ...state,
//     pocketValueTo: 50000.12,
//     pocketValueFrom: 50000.12,
//     isLoading: false,
//     currencies: {name: 'EUR', value: 50000.12},
//     selectedFrom: {name: 'GBP', value: 50000.12},
//     selectedTo: {name: 'USD', value: 50000.12},
//     currentRate: 1.236,
//     dataPoints: [{x: 1, y: 2}],
//     status: StatusTypes.idle,
//   };
//   const {getByText, debug, queryByTestId} = render(<CurrencyExchange />, {state: newState});
// });

// expect(setInitialData).toHaveBeenCalledTimes(1);
// expect(handleCurencyRateChange).toHaveBeenCalledTimes(1);
