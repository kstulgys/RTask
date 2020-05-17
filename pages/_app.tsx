import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import { theme } from 'theme'

function App(props: any) {
  const { Component, pageProps } = props
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <ColorModeProvider>
        <Component {...pageProps} />
      </ColorModeProvider>
    </ThemeProvider>
  )
}

export default App
