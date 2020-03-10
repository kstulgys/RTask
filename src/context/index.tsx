import * as React from 'react';
import {getCurrencies, getCurrentRate} from '../services/exchange-rates-api';

type Currency = {name: string; value: number};
type Currencies = Currency[];
type DataPoint = {x: number; y: number};
type DataPoints = DataPoint[];
type AvailableDays = 10 | 7 | 30 | 90 | 180 | 360 | 1800;

interface CurrencyState {
  isLoading: boolean;
  currencies: Currencies;
  currenciesFromFiltered: Currencies;
  currenciesToFiltered: Currencies;
  fromCurrency: Currency | null;
  toCurrency: Currency | null;
  chartData: DataPoints;
  currentRate: number | null;
  historyDaysAgo: AvailableDays;
  currencyFocused: 'From' | 'To';
  error: string | null;
  fromInputValue: number;
  toInputValue: number;
}

interface Action {
  type: string;
  payload?: any;
}

const initialState: CurrencyState = {
  isLoading: true,
  currencies: [],
  currenciesFromFiltered: [],
  currenciesToFiltered: [],
  fromCurrency: null,
  toCurrency: null,
  chartData: [],
  currentRate: null,
  historyDaysAgo: 30,
  currencyFocused: 'From',
  error: null,
  fromInputValue: 0,
  toInputValue: 0,
};

const actions = {
  FETCH_CURRENCIES_START: 'FETCH_CURRENCIES_START',
  FETCH_CURRENCIES_SUCCESS: 'FETCH_CURRENCIES_SUCCESS',
  FETCH_CURRENCIES_FAIL: 'FETCH_CURRENCIES_FAIL',

  SET_FROM_CURRENCY: 'SET_FROM_CURRENCY',
  SET_TO_CURRENCY: 'SET_TO_CURRENCY',

  SELECT_FROM_CURRENCY: 'SELECT_FROM_CURRENCY',
  SELECT_TO_CURRENCY: 'SELECT_TO_CURRENCY',

  FETCH_RATE_START: 'FETCH_RATE_START',
  FETCH_RATE_SUCCESS: 'FETCH_RATE_SUCCESS',
  FETCH_RATE_FAIL: 'FETCH_RATE_FAIL',

  SET_FILTERED_FROM_CURRENCIES: 'SET_FILTERED_FROM_CURRENCIES',
  SET_FILTERED_TO_CURRENCIES: 'SET_FILTERED_TO_CURRENCIES',

  FROM_INPUT_CHANGED: 'FROM_INPUT_CHANGED',
  TO_INPUT_CHANGED: 'TO_INPUT_CHANGED',
};

type CurrencyDispatch = React.Dispatch<Action>;

const CurrencyStateContext = React.createContext<CurrencyState>(initialState);
const CurrencyDispatchContext = React.createContext<CurrencyDispatch>({} as CurrencyDispatch);

function currencyReducer(state: CurrencyState, action: Action): CurrencyState {
  switch (action.type) {
    case actions.FETCH_CURRENCIES_START: {
      return {...state, isLoading: true};
    }
    case actions.FETCH_CURRENCIES_SUCCESS: {
      return {...state, currencies: action.payload, isLoading: false};
    }
    case actions.FETCH_CURRENCIES_FAIL: {
      return {...state, isLoading: false, error: action.payload};
    }
    case actions.SET_FROM_CURRENCY: {
      return {...state, fromCurrency: action.payload};
    }
    case actions.SET_TO_CURRENCY: {
      return {...state, toCurrency: action.payload};
    }
    case actions.SELECT_FROM_CURRENCY: {
      return {...state, fromCurrency: action.payload};
    }
    case actions.SELECT_TO_CURRENCY: {
      return {...state, toCurrency: action.payload};
    }
    case actions.FETCH_RATE_SUCCESS: {
      return {...state, currentRate: action.payload};
    }
    case actions.SET_FILTERED_FROM_CURRENCIES: {
      return {...state, currenciesFromFiltered: action.payload};
    }
    case actions.SET_FILTERED_TO_CURRENCIES: {
      return {...state, currenciesToFiltered: action.payload};
    }
    // case actions.SET_LOADING: {
    //   return {...state, isLoading: action.payload};
    // }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

interface CurrencyProviderProps {
  children: React.ReactNode;
}

function CurrencyProvider({children}: CurrencyProviderProps): JSX.Element {
  const [state, dispatch] = React.useReducer(currencyReducer, initialState);

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
    let interval: any = null;
    if (state.fromCurrency && state.toCurrency) {
      (function foo(): void {
        const {fromCurrency, toCurrency} = state;
        getCurrentRate({fromCurrency, toCurrency}).then(payload => {
          dispatch({
            type: actions.FETCH_RATE_SUCCESS,
            payload,
          });
        });
        interval = setTimeout(foo, 10000);
      })();
    }
    return () => interval && clearInterval(interval);
  }, [state.fromCurrency, state.toCurrency]);

  return (
    <CurrencyStateContext.Provider value={state}>
      <CurrencyDispatchContext.Provider value={dispatch}>{children}</CurrencyDispatchContext.Provider>
    </CurrencyStateContext.Provider>
  );
}

function useCurrencyState(): CurrencyState {
  const context = React.useContext(CurrencyStateContext);
  if (context === undefined) {
    throw new Error('useCurrencyState must be used within a CurrencyProvider');
  }
  return context;
}

function useCurrencyDispatch(): CurrencyDispatch {
  const context = React.useContext(CurrencyDispatchContext);
  if (context === undefined) {
    throw new Error('useCurrencyDispatch must be used within a CurrencyProvider');
  }
  return context;
}

function fetchCurrencies(dispatch: any): void {
  getCurrencies().then(currencies => {
    dispatch({
      type: actions.FETCH_CURRENCIES_SUCCESS,
      payload: currencies,
    });
  });
}

function setInitialFromToCurrency(dispatch: any, currencies: Currencies): void {
  const fromCurrency = currencies.find((c: Currency) => c?.name === 'GBP');
  const toCurrency = currencies.find((c: Currency) => c?.name === 'USD');
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

function selectFromCurrency(dispatch: any, payload: Currency): void {
  dispatch({
    type: actions.SELECT_FROM_CURRENCY,
    payload,
  });
}

function selectToCurrency(dispatch: any, payload: Currency): void {
  dispatch({
    type: actions.SELECT_TO_CURRENCY,
    payload,
  });
}

function filterFromCurrencies(dispatch: any, searchTerm: string, currencies: Currencies): void {
  const payload = currencies.filter(c => c?.name.includes(searchTerm.toUpperCase()));
  dispatch({
    type: actions.SET_FILTERED_FROM_CURRENCIES,
    payload,
  });
}

function filterToCurrencies(dispatch: any, searchTerm: string, currencies: Currencies): void {
  const payload = currencies.filter(c => c?.name.includes(searchTerm.toUpperCase()));
  dispatch({
    type: actions.SET_FILTERED_TO_CURRENCIES,
    payload,
  });
}

export {
  CurrencyProvider,
  useCurrencyState,
  useCurrencyDispatch,
  selectFromCurrency,
  selectToCurrency,
  filterFromCurrencies,
  filterToCurrencies,
};
