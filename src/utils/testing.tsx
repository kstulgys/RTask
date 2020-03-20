import React from 'react';
import {ThemeProvider, CSSReset} from '@chakra-ui/core';
import theme from 'theme';
import {Provider} from 'react-redux';
// import configureStore from 'redux-mock-store';
import {getDefaultMiddleware, configureStore} from '@reduxjs/toolkit';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {rootReducer} from 'app/store';

const currencies = [
  {name: 'GBP', value: 20000.99},
  {name: 'USD', value: 10000.33},
];
const preloadedState = {
  isLoading: false,
  isSubmitting: false,
  pocketValueFrom: currencies[0].value,
  pocketValueTo: currencies[1].value,
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
  timesSubmitted: 0,
};

function customRender(ui: any, partialState?: any) {
  // const mockStore = configureStore([...getDefaultMiddleware()]);
  // const store = mockStore({app: {...preloadedState, ...partialState}});

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {app: {...preloadedState, ...partialState}},
    middleware: [...getDefaultMiddleware()],
  });
  return {
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </Provider>,
    ),
    store,
  };
}

// re-export everything
export * from '@testing-library/react';

// override render method
export {customRender as render, preloadedState};
