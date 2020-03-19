import * as React from 'react';
import {cleanup, render, wait, fireEvent, waitForElement, preloadedState} from 'utils/testing';
import {InputAmount} from 'components/InputAmount';
import '@testing-library/jest-dom/extend-expect';
import user from '@testing-library/user-event';
// import {render} from '@testing-library/react';

beforeEach(cleanup);
beforeEach(() => {
  jest.clearAllMocks();
});

interface InputAmountProps {
  [key: string]: any;
  inputValue: number;
  selected: Currency | null;
  autoFocus: boolean;
  handleChange: any;
}

describe('Dropdown', () => {
  const props = {
    inputValue: 0,
    selected: {name: 'GBP', value: 30000},
    autoFocus: true,
    handleChange: jest.fn(),
  };
  it('Input', async () => {
    const {getByTestId, queryByTestId, debug} = render(<InputAmount {...props} />);
    const input = getByTestId('input-from');
    expect(input.value).toBe('');
    // user.type(input, '1000');
    // expect(input.value).toBe('1000');
  });
});
