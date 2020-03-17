/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, cleanup, loadedState, getByLabelText} from 'lib/utils/testing-utils';
import {CurrencyExchange} from './CurrencyExchange';
import {initialState} from 'context';
import {setInitialData} from 'context/actions';
import user from '@testing-library/user-event';

afterEach(cleanup);
beforeEach(cleanup);
jest.mock('context/actions');
beforeEach(() => {
  jest.clearAllMocks();
});

function setup(state: any) {
  return render(<CurrencyExchange />, {state});
}

it('has loader visible', async () => {
  const {getByTestId} = setup(initialState);
  expect(getByTestId('loader')).toBeInTheDocument();
});

it('has no loader when data is loaded', async () => {
  const {queryByTestId, debug} = setup(loadedState);
  debug();
  expect(queryByTestId(/loader/i)).toBeNull();
});

it('setInitialData has been called', () => {
  setup(initialState);
  expect(setInitialData).toBeCalled();
});

describe('Layout', () => {
  it('has title"', () => {
    const {getByText} = setup(loadedState);
    expect(getByText(/exchange money/i)).toBeInTheDocument();
  });

  it('has labels "From" and "to"', () => {
    const {getByText, getByTestId} = setup(loadedState);
    expect(getByText('From')).toBeInTheDocument();
    expect(getByText('To')).toBeInTheDocument();
  });

  it('has dropdown components"', () => {
    const {getByTestId} = setup(loadedState);
    expect(getByTestId('dropdown-from')).toBeInTheDocument();
    expect(getByTestId('dropdown-to')).toBeInTheDocument();
  });

  it('has pocket values"', () => {
    const {getByTestId} = setup(loadedState);
    expect(getByTestId('pocket-from')).toBeInTheDocument();
    expect(getByTestId('pocket-to')).toBeInTheDocument();
  });
  it('has input fields"', () => {
    const {getByTestId} = setup(loadedState);
    expect(getByTestId('input-from')).toBeInTheDocument();
    expect(getByTestId('input-to')).toBeInTheDocument();
  });
  it('has submit/continue button"', () => {
    const {getByText, getByTitle, container} = setup(loadedState);
    expect(container.querySelector('.submit-test')).toBeInTheDocument();
  });
  it('has current rate"', () => {
    const {getByTestId} = setup(loadedState);
    expect(getByTestId('current-rate')).toBeInTheDocument();
  });

  it('has current change"', () => {
    const {getByTestId} = setup(loadedState);
    expect(getByTestId('current-change')).toBeInTheDocument();
  });

  it('has "swapp" button"', () => {
    const {getByTestId} = setup(loadedState);
    expect(getByTestId('button-swap')).toBeInTheDocument();
  });
});
