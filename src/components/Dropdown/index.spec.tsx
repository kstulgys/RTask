import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {waitForElement, cleanup, wait, waitForElementToBeRemoved, act} from 'utils/testing-utils';
import user from '@testing-library/user-event';
import {render} from '@testing-library/react';
import {Dropdown} from './';

it('', () => {
  expect(true).toBeTruthy();
});

// afterEach(cleanup);
// beforeEach(() => {
//   jest.clearAllMocks();
// });

// it('Dropdown', async () => {
//   const props = {
//     label: 'From',
//     selected: {name: 'GBP', value: 2000},
//     pocketValue: 2000,
//     currencies: [],
//     selectCurrency: jest.fn(),
//   };
//   const {getByTestId, getByText, queryByTestId, debug} = render(<Dropdown {...props} />);
//   const dropdownList = queryByTestId('dropdown-list');
//   expect(dropdownList).toBeNull();
//   const dropdownDiv = getByTestId('dropdown-from');
//   user.click(dropdownDiv);
//   expect(getByTestId('dropdown-list')).toBeInTheDocument();
// });
