import * as React from 'react'
import ReactDOM from 'react-dom'
import App from './app/App'
import {ThemeProvider, CSSReset, ColorModeProvider} from '@chakra-ui/core'
import theme from 'theme'
import {Provider} from 'react-redux'
// import store from './app/store'

const render = () => {
  ReactDOM.render(
    // <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CSSReset />
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </ThemeProvider>,
    // </Provider>,
    document.getElementById('root'),
  )
}
render()
