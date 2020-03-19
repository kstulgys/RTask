import * as React from 'react';
import {render, cleanup, wait, fireEvent, waitForElement, preloadedState} from 'utils/testing';
import {Dropdown} from 'components/Dropdown';
import '@testing-library/jest-dom/extend-expect';
import user from '@testing-library/user-event';

beforeEach(cleanup);
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Dropdown', () => {
  const props = {
    label: 'From',
    selected: {name: 'GBP', value: 2000},
    pocketValue: 2000,
    currencies: [],
    selectCurrency: jest.fn(),
  };
  it('toggles dropdown list on click', async () => {
    const {getByTestId, queryByTestId, debug} = render(<Dropdown {...props} />);
    const dropdownList = queryByTestId('dropdown-list');
    expect(dropdownList).toBeNull();
    const dropdownDiv = getByTestId('dropdown-from');
    user.click(dropdownDiv);
    expect(getByTestId('dropdown-list')).toBeInTheDocument();
  });
});
