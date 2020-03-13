import * as React from 'react';
import {render} from 'react-dom';
import {CurrencyExchange} from './screens';
import {AppWrapper} from './components';
import {CurrencyProvider} from './context';

function App(): JSX.Element {
  return (
    <CurrencyProvider>
      <AppWrapper>
        <CurrencyExchange />
      </AppWrapper>
    </CurrencyProvider>
  );
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);
