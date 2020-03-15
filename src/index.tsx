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

// const loadAuthenticatedApp = () => import('./authenticated-app')
// const AuthenticatedApp = React.lazy(loadAuthenticatedApp)
// const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))

// function App() {
//   const user = useUser()
//   // pre-load the authenticated side in the background while the user's
//   // filling out the login form.
//   React.useEffect(() => {
//     loadAuthenticatedApp()
//   }, [])
//   return (
//     <React.Suspense fallback={<FullPageSpinner />}>
//       {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
//     </React.Suspense>
//   )
// }
