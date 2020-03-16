/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
import React from 'react';
import {render, cleanup} from '@testing-library/react';
import {CurrencyStateContext, CurrencyDispatchContext, initialState} from 'context';
import {ThemeProvider, CSSReset} from '@chakra-ui/core';
import theme from 'theme';

const customRender = (ui: any, {state = {}, dispatch = () => undefined, ...options} = {}) => {
  function Wrapper({children, props}: any) {
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
