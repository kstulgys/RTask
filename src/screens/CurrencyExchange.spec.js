/* eslint-disable react/prop-types */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, waitForElement, cleanup, wait, waitForElementToBeRemoved, waitFor} from 'lib/utils/testing-utils';
import {setInitialData, handleCurencyRateChange} from 'context/actions';
import {CurrencyExchange} from './';
import {StatusTypes} from 'context/types';
// beforeEach(cleanup);

const state = {
  isLoading: true,
  isSubmitting: false,
  pocketValueFrom: 0,
  pocketValueTo: 0,
  canSubmit: false,
  selectedFrom: null,
  selectedTo: null,
  currencies: [],
  dataPoints: [],
  currentRate: 0,
  inputValueFrom: 0,
  inputValueTo: 0,
  status: {name: 'idle', message: ''},
};

jest.mock('context/actions');

describe('Show/removes spinner', () => {
  it('shows spinner on initial render', async () => {
    const {getByTestId, debug} = render(<CurrencyExchange />, {state});
    expect(getByTestId('loader')).toBeInTheDocument();
    // expect(setInitialData).toBeCalled();
  });
  it('removes spinner', async () => {
    const newState = {...state, isLoading: false};
    const {getByText, debug, queryByTestId} = render(<CurrencyExchange />, {state: newState});
    expect(queryByTestId(/loader/i)).toBeNull();
    expect(getByText(/exchange money/i)).toBeInTheDocument();
  });
});

describe('Renders expected Layout after initial data is received', () => {
  const newState = {
    ...state,
    pocketValueTo: 50000.12,
    pocketValueFrom: 50000.12,
    isLoading: false,
    currencies: {name: 'EUR', value: 50000.12},
    selectedFrom: {name: 'GBP', value: 50000.12},
    selectedTo: {name: 'USD', value: 50000.12},
    currentRate: 1.236,
    dataPoints: [{x: 1, y: 2}],
    status: StatusTypes.idle,
  };
  const {getByText, debug, queryByTestId} = render(<CurrencyExchange />, {state: newState});
});
