import * as React from 'react';
import {getCurrencies, getCurrentRate, updatePockets} from '../services/exchangerates-api';
import {Currency, Currencies, CurrencyState, CurrencyDispatch, CurrencyProviderProps, Action} from './types';
import actions from './actions';
import reducer from './reducer';
import {FromOrTo, Label} from 'screens/types';
import {LabelSeries} from 'react-vis';
import {useSetInitialState, useSetInitialCurrencies, useCurrencyRatePolling, useUpdatePockets} from 'lib/hooks';

const initialState: CurrencyState = {
  // currencyFocused: 'From',
  // selectedFrom: {name: 'GBP', value: 0},
  // toCurrency: {name: 'USD', value: 0},
  selectedFromPocketValue: 0,
  selectedToPocketValue: 0,
  canSubmit: false,
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
  const {selectedFrom, selectedTo, currencies, inputValueFrom, inputValueTo} = state;

  useSetInitialState(dispatch);
  useSetInitialCurrencies({dispatch, currencies});
  useCurrencyRatePolling({dispatch, selectedFrom, selectedTo});
  useUpdatePockets({dispatch, inputValueFrom, inputValueTo, selectedFrom, selectedTo});

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

function useCurrencyDispatch() {
  const dispatch = React.useContext(CurrencyDispatchContext);
  if (dispatch === undefined) {
    throw new Error('useCurrencyDispatch must be used within a CurrencyProvider');
  }
  return dispatch;
}

function useMethods(state: CurrencyState, dispatch: CurrencyDispatch): any {
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
    const actionType = type === Label.from ? actions.SET_FILTERED_FROM_CURRENCIES : actions.SET_FILTERED_TO_CURRENCIES;
    dispatch({
      type: actionType,
      payload,
    });
  }

  function changeInputValue({input, type}: {input: string; type: FromOrTo}): void {
    const reachedDecimals = input[input.length - 4] === '.' || input[input.length - 4] === ',';
    if (reachedDecimals) return;
    const actionType = type === Label.from ? actions.FROM_INPUT_CHANGED : actions.TO_INPUT_CHANGED;
    const swappedActionType = type === Label.from ? actions.TO_INPUT_CHANGED : actions.FROM_INPUT_CHANGED;
    const operationOnToValue = (input: number): number => +(input * state.currentRate).toFixed(2);
    const operationOnFromValue = (input: number): number => +(input / state.currentRate).toFixed(2);
    const operation = type === Label.from ? operationOnToValue : operationOnFromValue;
    const computedValue = operation(+input);

    dispatch({
      type: actionType,
      payload: +input,
    });

    dispatch({
      type: swappedActionType,
      payload: computedValue,
    });
  }

  function swapInputs(): void {
    dispatch({
      type: actions.SWAP_INPUTS,
    });
  }

  return {
    filterCurrencies,
    currencySelect,
    changeInputValue,
    swapInputs,
  };
}

export {CurrencyProvider, useCurrencyState};
