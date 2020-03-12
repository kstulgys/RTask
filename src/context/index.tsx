import * as React from 'react';
import {getCurrencies, getCurrentRate, updatePockets} from '../services/exchange-rates-api';
import {Currency, Currencies, CurrencyState, CurrencyDispatch, CurrencyProviderProps, Action} from './types';
import actions from './actions';
import reducer from './reducer';
import {FromOrTo, Label} from 'screens/types';
import {LabelSeries} from 'react-vis';

const initialState: CurrencyState = {
  // currencyFocused: 'From',
  // selectedFrom: {name: 'GBP', value: 0},
  // toCurrency: {name: 'USD', value: 0},
  isLoading: true,
  filteredFrom: [],
  filteredTo: [],
  selectedFrom: null,
  selectedTo: null,
  currencies: [],
  dataPoints: [],
  historyDaysAgo: 30,
  currentRate: 0,
  inputValueFrom: 0,
  inputValueTo: 0,
  error: null,
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
      console.log({error});
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
    if (state.selectedFrom && state.selectedTo) {
      // (function foo(): void {
      const {selectedFrom, selectedTo} = state;
      getCurrentRate({selectedFrom, selectedTo}).then(payload => {
        dispatch({
          type: actions.FETCH_RATE_SUCCESS,
          payload,
        });
      });
      // interval = setTimeout(foo, 10000);
      // })();
    }
    // return (): void => interval && clearInterval(interval);
  }, [state.selectedFrom, state.selectedTo]);

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
  function selectselectedFrom(payload: Currency): void {
    dispatch({
      type: actions.SELECT_FROM_CURRENCY,
      payload,
    });
  }

  function currencySelect({type, name}: {type: FromOrTo; name: string}): void {
    const currencyFound = state.currencies.find(c => c.name === name);
    const actionType = type === Label.from ? actions.SELECT_FROM_CURRENCY : actions.SELECT_TO_CURRENCY;

    if (actionType && !!currencyFound) {
      dispatch({
        type: actionType,
        payload: currencyFound,
      });
    }
  }

  function filterCurrencies({type, searchTerm}: {type: string; searchTerm: string}): void {
    const payload = state.currencies.filter(c => c.name.includes(searchTerm.toUpperCase()));
    console.log({payload});
    const actionType = type === Label.from ? actions.SET_FILTERED_FROM_CURRENCIES : actions.SET_FILTERED_TO_CURRENCIES;
    dispatch({
      type: actionType,
      payload,
    });
  }

  function changeInputValue({input, type}: {input: string; type: FromOrTo}): void {
    const reachedDecimals = input[input.length - 4] === '.';
    if (reachedDecimals) return;
    const found = state.currencies.find(c => c.name === state.selectedFrom?.name);

    if (type === Label.from && found) {
      const value = Number((Number(input) * state.currentRate).toFixed(2));
      // const subtracted = Number((found.value - Number(input)).toFixed(2));
      // if (input[0] !== '-') {
      //   const withMinus = input.split('');
      //   withMinus.unshift('-');
      //   input = withMinus.join('');
      // }

      console.log(typeof input);
      dispatch({
        type: actions.FROM_INPUT_CHANGED,
        payload: Number(input),
      });
      dispatch({
        type: actions.TO_INPUT_CHANGED,
        payload: value,
      });
    }
    if (type === Label.to && found) {
      const value = Number((Number(input) / state.currentRate).toFixed(2));
      dispatch({
        type: actions.FROM_INPUT_CHANGED,
        payload: value,
      });
      dispatch({
        type: actions.TO_INPUT_CHANGED,
        payload: Number(input),
      });
    }
  }

  function swapInputs(): void {
    dispatch({
      type: actions.SWAP_INPUTS,
    });
  }

  // async function submitInputValues() {
  //   if (state.fromInputValue && state.toInputValue) {
  //     const from = {currency: state.selectedFrom.name, amount: state.fromInputValue};
  //     const to = {currency: state.toCurrency.name, amount: state.toInputValue};
  //     await updatePockets({from, to});
  //   }
  //   dispatch({
  //     type: actions.SUBMIT_INPUT_VALUES,
  //   });
  // }

  return {
    filterCurrencies,
    currencySelect,
    changeInputValue,
    swapInputs,
  };
}

function fetchCurrencies(dispatch: CurrencyDispatch): void {
  getCurrencies().then(currencies => {
    console.log({currencies});
    dispatch({
      type: actions.FETCH_CURRENCIES_SUCCESS,
      payload: currencies,
    });
  });
}

function setInitialFromToCurrency(dispatch: CurrencyDispatch, currencies: Currencies): void {
  console.log({currencies});
  const initialFrom = 'GBP';
  const initialTo = 'USD';

  const selectedFrom = currencies.find((c: Currency) => c?.name === initialFrom);
  const toCurrency = currencies.find((c: Currency) => c?.name === initialTo);

  if (selectedFrom) {
    dispatch({
      type: actions.SET_FROM_CURRENCY,
      payload: selectedFrom,
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
