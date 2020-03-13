/* eslint-disable react/prop-types */
import * as React from 'react';
import {render, waitForElement, cleanup, wait, waitForElementToBeRemoved} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {AppWrapper} from 'components';
import {CurrencyExchange} from './';
import {setInitialData, handleCurencyRateChange} from 'context/actions';
import {useCurrencyDispatch, useCurrencyState, CurrencyProvider} from 'context';

beforeEach(cleanup);

jest.mock('../context/actions', () => ({
  setInitialData: jest.fn(),
  handleCurencyRateChange: jest.fn(),
}));

function Wrapper({children}) {
  return (
    <CurrencyProvider>
      <AppWrapper>{children}</AppWrapper>
    </CurrencyProvider>
  );
}

test('Render with initial state', async () => {
  const {getByText, getByTestId} = render(
    <Wrapper>
      <CurrencyExchange />
    </Wrapper>,
  );
  await waitForElementToBeRemoved(() => getByTestId('loader'));
  expect(getByText('Exchange money')).toBeInTheDOM();
});
