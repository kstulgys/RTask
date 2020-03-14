/* eslint-disable react/prop-types */
import React from 'react';
import {render} from '@testing-library/react';
import {CurrencyStateContext, CurrencyDispatchContext} from 'context';
import {ThemeProvider, CSSReset} from '@chakra-ui/core';
import theme from 'theme';

const customRender = (ui, {state = {}, ...options} = {}) => {
  function Wrapper({children, props}) {
    return (
      <CurrencyStateContext.Provider value={state} {...props}>
        <CurrencyDispatchContext.Provider value={{dispatch: jest.fn()}}>
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
