import * as React from 'react';
import App from 'app/App';
import {render, cleanup, fireEvent} from 'utils/testing';
import {initialState} from 'app/appState';
import '@testing-library/jest-dom/extend-expect';

beforeEach(cleanup);
beforeEach(() => {
  jest.clearAllMocks();
});

it('has loader visible', async () => {
  const {getByTestId, debug} = render(<App />, {...initialState});
  debug();
  expect(getByTestId('loader')).toBeInTheDocument();
});

it('has no loader when data is loaded', async () => {
  const {queryByTestId, debug} = render(<App />);
  debug();
  expect(queryByTestId(/loader/i)).toBeNull();
});

describe('Layout', () => {
  it('has title"', () => {
    const {getByText} = render(<App />);
    expect(getByText(/exchange money/i)).toBeInTheDocument();
  });

  it('has labels "From" and "to"', () => {
    const {getByText, getByTestId} = render(<App />);
    expect(getByText('From')).toBeInTheDocument();
    expect(getByText('To')).toBeInTheDocument();
  });

  it('has dropdown components"', () => {
    const {getByTestId} = render(<App />);
    expect(getByTestId('dropdown-from')).toBeInTheDocument();
    expect(getByTestId('dropdown-to')).toBeInTheDocument();
  });

  it('has pocket values"', () => {
    const {getByTestId} = render(<App />);
    expect(getByTestId('pocket-from')).toBeInTheDocument();
    expect(getByTestId('pocket-to')).toBeInTheDocument();
  });
  it('has input fields"', () => {
    const {getByTestId} = render(<App />);
    expect(getByTestId('input-from')).toBeInTheDocument();
    expect(getByTestId('input-to')).toBeInTheDocument();
  });
  it('has submit/continue button"', () => {
    const {getByText, getByTitle, container} = render(<App />);
    expect(container.querySelector('.submit-test')).toBeInTheDocument();
  });
  it('has current rate"', () => {
    const {getByTestId} = render(<App />);
    expect(getByTestId('current-rate')).toBeInTheDocument();
  });

  it('has current change"', () => {
    const {getByTestId} = render(<App />);
    expect(getByTestId('current-change')).toBeInTheDocument();
  });

  it('has "swapp" button"', () => {
    const {getByTestId} = render(<App />);
    expect(getByTestId('button-swap')).toBeInTheDocument();
  });
});
