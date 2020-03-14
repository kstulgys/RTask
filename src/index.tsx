import * as React from 'react';
import {render} from 'react-dom';
import {CurrencyExchange} from './screens';
import {CurrencyProvider} from './context';
import {ThemeProvider, CSSReset} from '@chakra-ui/core';
import theme from 'theme';

function App(): JSX.Element {
  return (
    <CurrencyProvider>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <CurrencyExchange />
      </ThemeProvider>
    </CurrencyProvider>
  );
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);
