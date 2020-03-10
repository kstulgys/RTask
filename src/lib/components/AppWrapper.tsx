import * as React from 'react';
import {ThemeProvider, CSSReset} from '@chakra-ui/core';
import theme from '../../theme';

export function AppWrapper({children}: any) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      {children}
    </ThemeProvider>
  );
}
