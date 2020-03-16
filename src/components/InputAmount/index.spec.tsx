// import {
//     handleInputValueFromChange,
//     handleInputValueToChange,
//     handleCurencyRateChange,
//     handleCurrenciesSwapp,
//     selectFromCurrency,
//     selectToCurrency,
//     handleValuesSubmit,
//     SubmitValuesPayload,
//     InitialDataPayload,
//     setInitialData,
//   } from './actions';
//   import appReducer from './reducer';
//   import {initialState} from 'context';
//   import {StatusTypes} from './types';
//   import {ActionTypes} from './actionTypes';
//   import {build, fake} from '@jackfranklin/test-data-bot';
//   import {numberBetween} from 'lib/utils/helpers';
import * as React from 'react';
import {
  render,
  waitForElement,
  cleanup,
  wait,
  waitForElementToBeRemoved,
  act,
  fireEvent,
} from 'lib/utils/testing-utils';
import '@testing-library/jest-dom/extend-expect';
import user from '@testing-library/user-event';
import {InputAmount} from './';

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

describe('on From input value change', () => {
  it('chanages From pocket value', () => {
    const {debug, getByTestId} = render(<InputAmount {...fromInputProps} />);
    const input = getByTestId('input-from');
    const pocketValue = user.type(input, '12345.67');
    debug();
  });
});
