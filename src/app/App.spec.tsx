/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, cleanup, preloadedState, getByLabelText} from 'utils/testing-utils';
import App from 'app/App';
import {initialState} from 'app/appState';

afterEach(cleanup);
beforeEach(cleanup);
beforeEach(() => {
  jest.clearAllMocks();
});

function setup(state: any) {
  return render(<App />, {state});
}

it('has loader visible', async () => {
  const {getByTestId, debug} = setup(initialState);
  debug();
  expect(getByTestId('loader')).toBeInTheDocument();
});

it('has no loader when data is loaded', async () => {
  const {queryByTestId, debug} = setup(preloadedState);
  debug();
  expect(queryByTestId(/loader/i)).toBeNull();
});

describe('Layout', () => {
  it('has title"', () => {
    const {getByText} = setup(preloadedState);
    expect(getByText(/exchange money/i)).toBeInTheDocument();
  });

  it('has labels "From" and "to"', () => {
    const {getByText, getByTestId} = setup(preloadedState);
    expect(getByText('From')).toBeInTheDocument();
    expect(getByText('To')).toBeInTheDocument();
  });

  it('has dropdown components"', () => {
    const {getByTestId} = setup(preloadedState);
    expect(getByTestId('dropdown-from')).toBeInTheDocument();
    expect(getByTestId('dropdown-to')).toBeInTheDocument();
  });

  it('has pocket values"', () => {
    const {getByTestId} = setup(preloadedState);
    expect(getByTestId('pocket-from')).toBeInTheDocument();
    expect(getByTestId('pocket-to')).toBeInTheDocument();
  });
  it('has input fields"', () => {
    const {getByTestId} = setup(preloadedState);
    expect(getByTestId('input-from')).toBeInTheDocument();
    expect(getByTestId('input-to')).toBeInTheDocument();
  });
  it('has submit/continue button"', () => {
    const {getByText, getByTitle, container} = setup(preloadedState);
    expect(container.querySelector('.submit-test')).toBeInTheDocument();
  });
  it('has current rate"', () => {
    const {getByTestId} = setup(preloadedState);
    expect(getByTestId('current-rate')).toBeInTheDocument();
  });

  it('has current change"', () => {
    const {getByTestId} = setup(preloadedState);
    expect(getByTestId('current-change')).toBeInTheDocument();
  });

  it('has "swapp" button"', () => {
    const {getByTestId} = setup(preloadedState);
    expect(getByTestId('button-swap')).toBeInTheDocument();
  });
});
