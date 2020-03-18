/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
import React from 'react';
import {render, cleanup} from '@testing-library/react';
import {ThemeProvider, CSSReset} from '@chakra-ui/core';
import theme from 'theme';
import {Provider} from 'react-redux';
import store, {rootReducer} from 'app/store';
import {configureStore} from '@reduxjs/toolkit';

const currencies = [
  {name: 'GBP', value: 2000.99},
  {name: 'USD', value: 1000.33},
];
const preloadedState = {
  isLoading: false,
  isSubmitting: false,
  pocketValueFrom: 2000.99,
  pocketValueTo: 1000.33,
  canSubmit: false,
  selectedFrom: currencies[0],
  selectedTo: currencies[1],
  currencies: currencies,
  dataPoints: [
    {x: 1, y: 1},
    {x: 2, y: 2},
  ],
  currentRate: 1.1234,
  inputValueFrom: 0,
  inputValueTo: 0,
  error: null,
};

function AllProviders({children, state = preloadedState}: any) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {app: state},
  });
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        {children}
      </ThemeProvider>
    </Provider>
  );
}

function customRender(ui: any, {state = {}, ...options} = {}) {
  function Wrapper(props: any) {
    return <AllProviders state={state} {...props} />;
  }
  return render(ui, {wrapper: Wrapper, ...options});
}

// re-export everything
export * from '@testing-library/react';

// override render method
export {customRender as render, preloadedState};
