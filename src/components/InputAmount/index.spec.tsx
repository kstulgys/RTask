/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, cleanup, loadedState} from 'lib/utils/testing-utils';
import {InputAmount} from './';
import user from '@testing-library/user-event';
import {initialState} from 'context';
// import {handleInputValueFromChange, handleInputValueToChange} from 'context/actions';

afterEach(cleanup);
jest.mock('context/actions');
beforeEach(() => {
  jest.clearAllMocks();
});

const handleChange = jest.fn();
const fromInputProps = {
  inputValue: 0,
  selected: loadedState.selectedFrom,
  autoFocus: true,
  handleChange,
};

function setup(state: any) {
  const customState = state ? state : initialState;
  return render(<InputAmount {...fromInputProps} />, {state: customState});
}

describe('InputAmount', () => {
  it('has currency symbol', () => {
    const {getByTestId} = setup(loadedState);
    expect(getByTestId('currency-symbol')).toBeInTheDocument();
  });
  it('calls handleInputValueFromChange', () => {
    const {getByTestId} = setup(loadedState);
    const input = getByTestId('input-from');
    user.type(input, '1234.56');
    expect(handleChange).toBeCalled();
  });

  // it('calls handleInputValueToChange', () => {
  //   const {getByTestId} = setup(loadedState);
  //   const input = getByTestId('input-to');
  //   user.type(input, '1234.56');
  //   expect(handleInputValueToChange).toBeCalled();
  // });
});
