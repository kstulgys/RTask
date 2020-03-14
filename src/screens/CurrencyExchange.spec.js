/* eslint-disable react/prop-types */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, waitForElement, cleanup, wait, waitForElementToBeRemoved, waitFor} from 'lib/utils/testing-utils';
import {setInitialData, handleCurencyRateChange} from 'context/actions';
import {CurrencyExchange} from './';

// beforeEach(cleanup);

const state = {
  isLoading: true,
  isSubmitting: false,
  selectedFromPocketValue: 0,
  selectedToPocketValue: 0,
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

describe('Renders expected Layout', () => {
  it('Shows loader when on initial render', async () => {
    const {getByTestId, debug} = render(<CurrencyExchange />, {state});
    expect(getByTestId('loader')).toBeInTheDocument();
    // expect(setInitialData).toBeCalled();
  });
  it('Show loader/spinner when app is initialy started', async () => {
    const newState = {...state, isLoading: false};
    const {getByText, debug, queryByTestId} = render(<CurrencyExchange />, {state: newState});
    expect(queryByTestId(/loader/i)).toBeNull();
    expect(getByText(/exchange money/i)).toBeInTheDocument();
  });
});
