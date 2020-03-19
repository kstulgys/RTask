import * as React from 'react';
import {render, cleanup, fireEvent} from 'utils/testing';
import {ButtonContinue} from 'components/ButtonContinue';
import '@testing-library/jest-dom/extend-expect';
import user from '@testing-library/user-event';

beforeEach(cleanup);
beforeEach(() => {
  jest.clearAllMocks();
});

it('renders is in the DOM', () => {
  const buttonProps = {
    text: 'Continue',
  };
  const {getByText} = render(<ButtonContinue {...buttonProps} />);
  expect(getByText('Continue')).toBeInTheDocument();
});

it('button is disabled', () => {
  const buttonProps = {
    text: 'Continue',
  };
  const {getByText, debug} = render(<ButtonContinue {...buttonProps} />);
  debug();
  const button = getByText('Continue');
  expect(button.disabled).toBeTruthy();
});

it('button is enabled', () => {
  const buttonProps = {
    text: 'Continue',
  };
  const {getByText, debug} = render(<ButtonContinue {...buttonProps} />, {canSubmit: true});
  debug();
  const button = getByText('Continue');
  expect(button.disabled).toBeFalsy();
});

it('submitValues is called', () => {
  const buttonProps = {
    text: 'Continue',
  };
  const {getByText, debug} = render(<ButtonContinue {...buttonProps} />, {canSubmit: true});
  debug();
  const button = getByText('Continue');
  user.click(button);
});
