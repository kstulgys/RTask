import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, waitForElement, cleanup, wait, waitForElementToBeRemoved, act} from 'lib/utils/testing-utils';
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
import user from '@testing-library/user-event';
import {InputAmount} from './';
import {Label} from 'screens/types';
afterEach(cleanup);

jest.mock('context/actions');

beforeEach(() => {
  jest.clearAllMocks();
});

it('Dropdown', async () => {
  const handleChange = jest.fn();
  const props = {
    inputValue: 0,
    selected: {name: 'GBP', value: 2000},
    autoFocus: true,
    handleChange,
  };

  const {getByTestId, getByText, queryByTestId, debug} = render(<InputAmount {...props} />);
  const input = getByTestId('input-from');
  user.type(input, '1234.56');
  expect(handleChange).toBeCalledTimes(6);
});
