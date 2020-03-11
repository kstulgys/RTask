import * as React from 'react';
import {getCurrencies, getCurrentRate} from '../services/exchange-rates-api';
import {Currency, Currencies, CurrencyState, CurrencyDispatch, CurrencyProviderProps, Action} from './types';
import actions from './actions';
import reducer from './reducer';
import {FromOrTo, Label} from 'screens/types';

const initialState: CurrencyState = {
  isLoading: true,
  currencies: [],
  currenciesFromFiltered: [],
  currenciesToFiltered: [],
  fromCurrency: null,
  toCurrency: null,
  chartData: [],
  currentRate: 0,
  historyDaysAgo: 30,
  currencyFocused: 'From',
  error: null,
  fromInputValue: 0,
  toInputValue: 0,
};

const CurrencyStateContext = React.createContext<CurrencyState>(initialState);
const CurrencyDispatchContext = React.createContext<React.Dispatch<Action>>({} as React.Dispatch<Action>);

function CurrencyProvider({children}: CurrencyProviderProps): JSX.Element {
  const [state, dispatch] = React.useReducer<React.Reducer<CurrencyState, Action>>(reducer, initialState);

  React.useEffect(() => {
    // setLoading(dispatch, true);
    try {
      fetchCurrencies(dispatch);
    } catch (error) {
      dispatch({
        type: actions.FETCH_CURRENCIES_FAIL,
        payload: error,
      });
    }
  }, []);

  React.useEffect(() => {
    if (state.currencies.length > 0) {
      setInitialFromToCurrency(dispatch, state.currencies);
    }
  }, [state.currencies]);

  React.useEffect(() => {
    // let interval: any = null;
    if (state.fromCurrency && state.toCurrency) {
      // (function foo(): void {
      const {fromCurrency, toCurrency} = state;
      getCurrentRate({fromCurrency, toCurrency}).then(payload => {
        dispatch({
          type: actions.FETCH_RATE_SUCCESS,
          payload,
        });
      });
      // interval = setTimeout(foo, 10000);
      // })();
    }
    // return (): void => interval && clearInterval(interval);
  }, [state.fromCurrency, state.toCurrency]);

  return (
    <CurrencyStateContext.Provider value={state}>
      <CurrencyDispatchContext.Provider value={dispatch}>{children}</CurrencyDispatchContext.Provider>
    </CurrencyStateContext.Provider>
  );
}

function useCurrencyState() {
  const state = React.useContext(CurrencyStateContext);
  const dispatch = useCurrencyDispatch();
  const methods = useMethods(state, dispatch);
  if (methods === undefined) {
    throw new Error('useCurrencyState must be used within a CurrencyProvider');
  }
  return {...state, ...methods};
}

function useCurrencyDispatch(): CurrencyDispatch {
  const dispatch = React.useContext(CurrencyDispatchContext);
  if (dispatch === undefined) {
    throw new Error('useCurrencyDispatch must be used within a CurrencyProvider');
  }
  return dispatch;
}

function useMethods(state: CurrencyState, dispatch: CurrencyDispatch): any {
  function selectFromCurrency(payload: Currency): void {
    dispatch({
      type: actions.SELECT_FROM_CURRENCY,
      payload,
    });
  }

  function selectToCurrency(payload: Currency): void {
    dispatch({
      type: actions.SELECT_TO_CURRENCY,
      payload,
    });
  }

  function filterFromCurrencies(searchTerm: string, currencies: Currencies): void {
    const payload = currencies.filter(c => c?.name.includes(searchTerm.toUpperCase()));
    dispatch({
      type: actions.SET_FILTERED_FROM_CURRENCIES,
      payload,
    });
  }

  function filterToCurrencies(searchTerm: string, currencies: Currencies): void {
    const payload = currencies.filter(c => c?.name.includes(searchTerm.toUpperCase()));
    dispatch({
      type: actions.SET_FILTERED_TO_CURRENCIES,
      payload,
    });
  }

  function changeInputValue({input, type}: {input: string; type: FromOrTo}): void {
    const reachedDecimals = input[input.length - 4] === '.';
    if (reachedDecimals) return;

    if (type === Label.from) {
      const value = Number((Number(input) * state.currentRate).toFixed(2));
      dispatch({
        type: actions.FROM_INPUT_CHANGED,
        payload: input,
      });
      dispatch({
        type: actions.TO_INPUT_CHANGED,
        payload: value,
      });
    }
    if (type === Label.to) {
      const value = Number((Number(input) / state.currentRate).toFixed(2));
      dispatch({
        type: actions.FROM_INPUT_CHANGED,
        payload: value,
      });
      dispatch({
        type: actions.TO_INPUT_CHANGED,
        payload: input,
      });
    }
  }

  function swapInputs(): void {
    dispatch({
      type: actions.SWAP_INPUTS,
    });
  }

  return {
    selectFromCurrency,
    selectToCurrency,
    filterFromCurrencies,
    filterToCurrencies,
    changeInputValue,
    swapInputs,
  };
}

function fetchCurrencies(dispatch: CurrencyDispatch): void {
  getCurrencies().then(currencies => {
    dispatch({
      type: actions.FETCH_CURRENCIES_SUCCESS,
      payload: currencies,
    });
  });
}

function setInitialFromToCurrency(dispatch: CurrencyDispatch, currencies: Currencies): void {
  const initialFrom = 'GBP';
  const initialTo = 'USD';

  const fromCurrency = currencies.find((c: Currency) => c?.name === initialFrom);
  const toCurrency = currencies.find((c: Currency) => c?.name === initialTo);

  if (fromCurrency) {
    dispatch({
      type: actions.SET_FROM_CURRENCY,
      payload: fromCurrency,
    });
  }
  if (toCurrency) {
    dispatch({
      type: actions.SET_TO_CURRENCY,
      payload: toCurrency,
    });
  }
}

export {CurrencyProvider, useCurrencyState};
