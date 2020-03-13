import * as React from 'react';
import {CurrencyExchange} from './screens';
import {AppWrapper} from './components';
import {CurrencyProvider} from './context';

export default function App(): JSX.Element {
  return (
    <CurrencyProvider>
      <AppWrapper>
        <CurrencyExchange />
      </AppWrapper>
    </CurrencyProvider>
  );
}
