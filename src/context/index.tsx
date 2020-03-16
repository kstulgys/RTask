import * as React from 'react';
import {CurrencyState, CurrencyProviderProps, Action} from './types';
import reducer from './reducer';

export const initialState: CurrencyState = {
  isLoading: true,
  isSubmitting: false,
  pocketValueFrom: 0,
  pocketValueTo: 0,
  canSubmit: false,
  selectedFrom: null,
  selectedTo: null,
  currencies: [],
  dataPoints: [],
  currentRate: 0,
  inputValueFrom: 0,
  inputValueTo: 0,
  status: {name: 'idle', message: ''},
};

const CurrencyStateContext = React.createContext<CurrencyState>(initialState);
const CurrencyDispatchContext = React.createContext<React.Dispatch<Action>>({} as React.Dispatch<Action>);

function CurrencyProvider({children}: CurrencyProviderProps): JSX.Element {
  const [state, dispatch] = React.useReducer<React.Reducer<CurrencyState, Action>>(reducer, initialState);

  return (
    <CurrencyStateContext.Provider value={state}>
      <CurrencyDispatchContext.Provider value={dispatch}>{children}</CurrencyDispatchContext.Provider>
    </CurrencyStateContext.Provider>
  );
}

function useCurrencyState() {
  const state = React.useContext(CurrencyStateContext);
  if (state === undefined) {
    throw new Error('useCurrencyState must be used within a CurrencyProvider');
  }
  return state;
}

function useCurrencyDispatch() {
  const dispatch = React.useContext(CurrencyDispatchContext);
  if (dispatch === undefined) {
    throw new Error('useCurrencyDispatch must be used within a CurrencyProvider');
  }
  return dispatch;
}

export {CurrencyProvider, useCurrencyState, useCurrencyDispatch, CurrencyStateContext, CurrencyDispatchContext};

function useReducer(reducer: (state: object, action: object) => object, initState: object) {
  const [state, setState] = React.useState(initState);

  const dispatch = ({type, payload}: any) => {
    const newState = reducer(initState, {type, payload});
    setState(newState);
  };

  return [state, dispatch];
}
