import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, waitForElement, cleanup, wait, waitForElementToBeRemoved, act} from 'lib/utils/testing-utils';
import user from '@testing-library/user-event';
import {Dropdown} from './';
import {Label} from 'screens/types';
afterEach(cleanup);

jest.mock('context/actions');

beforeEach(() => {
  jest.clearAllMocks();
});

it('Dropdown', async () => {
  const props = {
    label: Label.from,
    selected: {name: 'GBP', value: 2000},
    pocketValue: 2000,
    currencies: [],
    selectCurrency: jest.fn(),
  };
  const {getByTestId, getByText, queryByTestId, debug} = render(<Dropdown {...props} />);
  const dropdownList = queryByTestId('dropdown-list');
  expect(dropdownList).toBeNull();
  const dropdownDiv = getByTestId('dropdown-from');
  debug();
  user.click(dropdownDiv);
  expect(getByTestId('dropdown-list')).toBeInTheDocument();
});
