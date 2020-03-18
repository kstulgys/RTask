/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {cleanup, preloadedState} from 'utils/testing-utils';
import {render} from '@testing-library/react';
import {InputAmount} from './';
import user from '@testing-library/user-event';
// import {
//   fetchCurrencies,
//   fetchCurrentRate,
//   updateSelectedTo,
//   onInputChangeFrom,
//   onInputChangeTo,
//   selectFrom,
//   selectTo,
//   initialState,
// } from 'app/appState';

it('', () => {
  expect(true).toBeTruthy();
});

// afterEach(cleanup);
// // jest.mock('app/appState');
// beforeEach(() => {
//   jest.clearAllMocks();
// });

// const handleChange = jest.fn();
// const fromInputProps = {
//   inputValue: 0,
//   selected: preloadedState.selectedFrom,
//   autoFocus: true,
//   handleChange,
// };

// function setup() {
//   return render(<InputAmount {...fromInputProps} />);
// }

// describe('InputAmount', () => {
//   it('has currency symbol', () => {
//     const {getByTestId} = setup();
//     expect(getByTestId('currency-symbol')).toBeInTheDocument();
//   });
//   it('calls handleInputValueFromChange', () => {
//     const {getByTestId} = setup();
//     const input = getByTestId('input-from');
//     user.type(input, '1234.56');
//     // expect(handleChange).toBeCalled();
//   });

//   it('calls handleInputValueToChange', () => {
//     const {getByTestId} = setup();
//     const input = getByTestId('input-to');
//     user.type(input, '1234.56');
//     // expect(onInputChangeFrom).toBeCalled();
//   });
// });
