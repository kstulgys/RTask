/* eslint-disable react/prop-types */
import React from 'react';
import {render} from '@testing-library/react';
import {CurrencyStateContext, CurrencyDispatchContext, initialState} from 'context';
import {ThemeProvider, CSSReset} from '@chakra-ui/core';
import theme from 'theme';
import appReducer from 'context/reducer';

const customRender = (ui, {state = {}, dispatch = () => undefined, ...options} = {}) => {
  function Wrapper({children, props}) {
    const [state, dispatch] = React.useReducer(appReducer, initialState);
    return (
      <CurrencyStateContext.Provider value={state} {...props}>
        <CurrencyDispatchContext.Provider value={dispatch}>
          <ThemeProvider theme={theme}>
            <CSSReset />
            {children}
          </ThemeProvider>
        </CurrencyDispatchContext.Provider>
      </CurrencyStateContext.Provider>
    );
  }
  return render(ui, {wrapper: Wrapper, ...options});
};

// re-export everything
export * from '@testing-library/react';

// override render method
export {customRender as render};
