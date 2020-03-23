import * as React from 'react';
import {render, cleanup, fireEvent} from 'utils/testing';
import {ButtonContinue} from 'components/ButtonContinue';
import '@testing-library/jest-dom/extend-expect';
import user from '@testing-library/user-event';

beforeEach(cleanup);

const handleSubmit = jest.fn();
const buttonProps = {
  text: 'Continue',
  handleSubmit,
};

const setup = (state = {}) => {
  const {getByText} = render(<ButtonContinue {...buttonProps} />, {...state});
  return getByText('Continue');
};

it('button is disabled', () => {
  const button = setup();
  expect(button.disabled).toBeTruthy();
});

it('button is enabled', () => {
  // setup({state: {canSubmit: true}});
  const button = setup({canSubmit: true});
  expect(button.disabled).toBeFalsy();
});
