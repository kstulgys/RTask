import * as React from 'react';
import {AppWrapper} from './components';
import {CurrencyExchange} from './screens';
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
